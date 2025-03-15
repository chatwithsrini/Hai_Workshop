import { ObjectId } from 'mongodb';
import { getDB } from '../config/db';
import { IBook, IBookStock, ICreateBookDTO, IUpdateStockDTO, IUpdateBookDTO, IBookWithStock } from '../models/IBook';

class BookService {
    async createBook(bookData: ICreateBookDTO): Promise<IBookWithStock> {
        const db = getDB();
        const booksCollection = db.collection('books');
        const stockCollection = db.collection('bookStocks');

        const now = new Date();

        // Create book entry
        const bookResult = await booksCollection.insertOne({
            title: bookData.title,
            description: bookData.description,
            author: bookData.author,
            category: bookData.category,
            imageUrl: bookData.imageUrl,
            isbn: bookData.isbn,
            publisher: bookData.publisher,
            publishedYear: bookData.publishedYear,
            dateCreated: now,
            dateUpdated: now
        });

        // Create stock entry
        await stockCollection.insertOne({
            bookId: bookResult.insertedId.toString(),
            quantity: bookData.initialStock,
            price: bookData.price,
            dateCreated: now,
            dateUpdated: now
        });

        return {
            id: bookResult.insertedId.toString(),
            title: bookData.title,
            description: bookData.description,
            author: bookData.author,
            category: bookData.category,
            imageUrl: bookData.imageUrl,
            isbn: bookData.isbn,
            publisher: bookData.publisher,
            publishedYear: bookData.publishedYear,
            stock: bookData.initialStock,
            price: bookData.price,
            dateCreated: now,
            dateUpdated: now
        };
    }

    async getAllBooks(): Promise<IBookWithStock[]> {
        const db = getDB();
        const booksCollection = db.collection('books');
        const stockCollection = db.collection('bookStocks');

        const books = await booksCollection.find({}).toArray();
        const booksWithStock: IBookWithStock[] = [];

        for (const book of books) {
            const stock = await stockCollection.findOne({ bookId: book._id.toString() });
            booksWithStock.push({
                id: book._id.toString(),
                title: book.title,
                description: book.description,
                author: book.author,
                category: book.category,
                imageUrl: book.imageUrl,
                isbn: book.isbn,
                publisher: book.publisher,
                publishedYear: book.publishedYear,
                stock: stock?.quantity || 0,
                price: stock?.price || 0,
                dateCreated: book.dateCreated,
                dateUpdated: book.dateUpdated
            });
        }

        return booksWithStock;
    }

    async getBookById(bookId: string): Promise<IBookWithStock | null> {
        const db = getDB();
        const booksCollection = db.collection('books');
        const stockCollection = db.collection('bookStocks');

        const book = await booksCollection.findOne({ _id: new ObjectId(bookId) });
        if (!book) return null;

        const stock = await stockCollection.findOne({ bookId: bookId });
        if (!stock) return null;

        return {
            id: book._id.toString(),
            title: book.title,
            description: book.description,
            author: book.author,
            category: book.category,
            imageUrl: book.imageUrl,
            isbn: book.isbn,
            publisher: book.publisher,
            publishedYear: book.publishedYear,
            stock: stock.quantity,
            price: stock.price,
            dateCreated: book.dateCreated,
            dateUpdated: book.dateUpdated
        };
    }

    async updateBook(bookId: string, updateData: IUpdateBookDTO): Promise<IBookWithStock | null> {
        try {
            const db = getDB();
            const booksCollection = db.collection('books');
            const stockCollection = db.collection('bookStocks');

            // Ensure valid ObjectId
            if (!ObjectId.isValid(bookId)) {
                return null;
            }

            // Separate book fields from stock fields
            const bookUpdate: Partial<IBook> & { dateUpdated: Date } = { 
                dateUpdated: new Date() 
            };
            const stockUpdate: { price?: number; quantity?: number; dateUpdated: Date } = {
                dateUpdated: new Date()
            };

            // Update book fields if they exist in updateData
            const bookFields = ['title', 'description', 'author', 'category', 'imageUrl', 'isbn', 'publisher', 'publishedYear'] as const;
            type BookField = typeof bookFields[number];
            
            for (const field of bookFields) {
                if (field in updateData) {
                    (bookUpdate as any)[field] = updateData[field as BookField];
                }
            }

            // Update stock fields if they exist in updateData
            if ('price' in updateData) {
                stockUpdate.price = updateData.price;
            }
            if ('stock' in updateData || 'quantity' in updateData) {
                stockUpdate.quantity = updateData.stock || updateData.quantity;
            }

            // Update book details
            const bookResult = await booksCollection.findOneAndUpdate(
                { _id: new ObjectId(bookId) },
                { $set: bookUpdate },
                { returnDocument: 'after' }
            );

            if (!bookResult) return null;

            // Update stock if price or quantity changed
            if (stockUpdate.price !== undefined || stockUpdate.quantity !== undefined) {
                const stockResult = await stockCollection.findOneAndUpdate(
                    { bookId: bookId },
                    { $set: stockUpdate },
                    { returnDocument: 'after', upsert: true }
                );
                
                if (!stockResult) return null;
            }

            // Fetch fresh data after both updates are complete
            const updatedBook = await this.getBookById(bookId);
            return updatedBook;
        } catch (error) {
            console.error('Error updating book:', error);
            return null;
        }
    }

    async updateStock(bookId: string, { quantity }: IUpdateStockDTO): Promise<IBookWithStock | null> {
        try {
            const db = getDB();
            const stockCollection = db.collection('bookStocks');

            if (!ObjectId.isValid(bookId)) {
                return null;
            }

            const result = await stockCollection.findOneAndUpdate(
                { bookId },
                { 
                    $set: { 
                        quantity,
                        dateUpdated: new Date()
                    }
                },
                { returnDocument: 'after' }
            );

            if (!result) return null;

            return this.getBookById(bookId);
        } catch (error) {
            console.error('Error updating stock:', error);
            return null;
        }
    }

    async deleteBook(bookId: string): Promise<boolean> {
        try {
            const db = getDB();
            const booksCollection = db.collection('books');
            const stockCollection = db.collection('bookStocks');

            if (!ObjectId.isValid(bookId)) {
                return false;
            }

            const bookResult = await booksCollection.deleteOne({ _id: new ObjectId(bookId) });
            await stockCollection.deleteOne({ bookId });

            return bookResult.deletedCount === 1;
        } catch (error) {
            console.error('Error deleting book:', error);
            return false;
        }
    }

    async clearAllBooks(): Promise<void> {
        try {
            const db = getDB();
            await db.collection('books').deleteMany({});
            await db.collection('bookStocks').deleteMany({});
        } catch (error) {
            console.error('Error clearing books:', error);
            throw error;
        }
    }

    async addInitialBooks(): Promise<void> {
        const books: ICreateBookDTO[] = [
            {
                title: "A Brief History of Time",
                description: "An exploration of cosmology by Stephen Hawking, covering the Big Bang, black holes, and the nature of time.",
                author: "Stephen Hawking",
                category: "physics",
                isbn: "978-0553380163",
                publisher: "Bantam",
                publishedYear: 1988,
                initialStock: 10,
                price: 29.99
            },
            {
                title: "Organic Chemistry",
                description: "A comprehensive guide to organic chemistry principles and reactions.",
                author: "John McMurry",
                category: "chemistry",
                isbn: "978-1305080485",
                publisher: "Cengage Learning",
                publishedYear: 2015,
                initialStock: 15,
                price: 49.99
            },
            {
                title: "Campbell Biology",
                description: "A detailed exploration of biological concepts and principles.",
                author: "Lisa Urry",
                category: "biology",
                isbn: "978-0134093413",
                publisher: "Pearson",
                publishedYear: 2016,
                initialStock: 12,
                price: 54.99
            },
            {
                title: "Advanced Calculus",
                description: "An in-depth study of calculus concepts and applications.",
                author: "Michael Spivak",
                category: "mathematics",
                isbn: "978-0914098911",
                publisher: "Cambridge University Press",
                publishedYear: 2008,
                initialStock: 8,
                price: 44.99
            }
        ];

        for (const book of books) {
            await this.createBook(book);
        }
    }
}

export default new BookService();
