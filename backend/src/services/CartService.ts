import { ObjectId } from 'mongodb';
import { getDB } from '../config/db';
import { ICart, ICartItem, IAddToCartDTO, IUpdateCartItemDTO, ICartWithBooks } from '../models/ICart';
import BookService from './BookService';

interface OrderResult {
    success: boolean;
    message?: string;
    orderedItems?: Array<{
        bookId: string;
        quantity: number;
        price: number;
    }>;
}

class CartService {
    async getCart(userId: string): Promise<ICartWithBooks> {
        const db = getDB();
        const cartCollection = db.collection('carts');
        const cartItemsCollection = db.collection('cartItems');

        // Get or create cart
        let cart = await cartCollection.findOne({ userId });
        if (!cart) {
            const now = new Date();
            const result = await cartCollection.insertOne({
                userId,
                total: 0,
                dateCreated: now,
                dateUpdated: now
            });
            cart = {
                _id: result.insertedId,
                userId,
                total: 0,
                dateCreated: now,
                dateUpdated: now
            };
        }

        // Get cart items with book details
        const items = await cartItemsCollection.find({ userId }).toArray();
        const itemsWithBooks = [];
        let total = 0;

        for (const item of items) {
            const book = await BookService.getBookById(item.bookId);
            if (book) {
                itemsWithBooks.push({
                    id: item._id.toString(),
                    bookId: item.bookId,
                    userId: item.userId,
                    quantity: item.quantity,
                    price: item.price,
                    dateCreated: item.dateCreated,
                    dateUpdated: item.dateUpdated,
                    book: {
                        title: book.title,
                        author: book.author,
                        imageUrl: book.imageUrl
                    }
                });
                total += item.price * item.quantity;
            }
        }

        // Update cart total if needed
        if (total !== cart.total) {
            await cartCollection.updateOne(
                { _id: cart._id },
                { $set: { total, dateUpdated: new Date() } }
            );
        }

        return {
            id: cart._id.toString(),
            userId,
            items: itemsWithBooks,
            total,
            dateCreated: cart.dateCreated,
            dateUpdated: cart.dateUpdated
        };
    }

    async addToCart(userId: string, { bookId, quantity }: IAddToCartDTO): Promise<ICartWithBooks> {
        const db = getDB();
        const cartItemsCollection = db.collection('cartItems');

        // Get book to verify it exists and get price
        const book = await BookService.getBookById(bookId);
        if (!book) {
            throw new Error('Book not found');
        }

        // Check if item already in cart
        const existingItem = await cartItemsCollection.findOne({ userId, bookId });
        const now = new Date();

        if (existingItem) {
            // Update existing item
            await cartItemsCollection.updateOne(
                { _id: existingItem._id },
                {
                    $set: {
                        quantity: existingItem.quantity + quantity,
                        dateUpdated: now
                    }
                }
            );
        } else {
            // Add new item
            await cartItemsCollection.insertOne({
                userId,
                bookId,
                quantity,
                price: book.price,
                dateCreated: now,
                dateUpdated: now
            });
        }

        const cart = await this.getCart(userId);
        return cart;
    }

    async updateCartItem(userId: string, itemId: string, { quantity }: IUpdateCartItemDTO): Promise<ICartWithBooks> {
        const db = getDB();
        const cartItemsCollection = db.collection('cartItems');

        if (quantity < 0) {
            throw new Error('Quantity cannot be negative');
        }

        if (quantity === 0) {
            await cartItemsCollection.deleteOne({ _id: new ObjectId(itemId), userId });
        } else {
            await cartItemsCollection.updateOne(
                { _id: new ObjectId(itemId), userId },
                {
                    $set: {
                        quantity,
                        dateUpdated: new Date()
                    }
                }
            );
        }

        const cart = await this.getCart(userId);
        return cart;
    }

    async removeFromCart(userId: string, itemId: string): Promise<ICartWithBooks> {
        const db = getDB();
        const cartItemsCollection = db.collection('cartItems');

        await cartItemsCollection.deleteOne({ _id: new ObjectId(itemId), userId });
        const cart = await this.getCart(userId);
        return cart;
    }

    async clearCart(userId: string): Promise<void> {
        const db = getDB();
        const cartItemsCollection = db.collection('cartItems');
        const cartCollection = db.collection('carts');

        await cartItemsCollection.deleteMany({ userId });
        await cartCollection.updateOne(
            { userId },
            {
                $set: {
                    total: 0,
                    dateUpdated: new Date()
                }
            }
        );
    }

    async placeOrder(userId: string): Promise<OrderResult> {
        const db = getDB();
        const cartItemsCollection = db.collection('cartItems');
        
        // Get all cart items
        const cartItems = await cartItemsCollection.find({ userId }).toArray();
        
        if (cartItems.length === 0) {
            return {
                success: false,
                message: 'Cart is empty'
            };
        }

        const orderedItems = [];
        
        // Verify stock and update for each item
        for (const item of cartItems) {
            const book = await BookService.getBookById(item.bookId);
            
            if (!book) {
                return {
                    success: false,
                    message: `Book not found for item ${item.bookId}`
                };
            }

            if (book.stock < item.quantity) {
                return {
                    success: false,
                    message: `Insufficient stock for book: ${book.title}`
                };
            }

            // Update stock
            const updatedBook = await BookService.updateStock(item.bookId, {
                quantity: book.stock - item.quantity
            });

            if (!updatedBook) {
                return {
                    success: false,
                    message: `Failed to update stock for book: ${book.title}`
                };
            }

            orderedItems.push({
                bookId: item.bookId,
                quantity: item.quantity,
                price: item.price
            });
        }

        // Clear the cart after successful order
        await this.clearCart(userId);

        return {
            success: true,
            message: 'Order placed successfully',
            orderedItems
        };
    }
}

export default new CartService();
