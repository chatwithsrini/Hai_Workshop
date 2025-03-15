import { ObjectId } from 'mongodb';
import { getDB } from '../config/db';
import { IBook, IBookStock, ICreateBookDTO, IUpdateStockDTO, IBookWithStock } from '../models/IBook';

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

    async updateStock(bookId: string, { quantity }: IUpdateStockDTO): Promise<IBookWithStock | null> {
        const db = getDB();
        const stockCollection = db.collection('bookStocks');

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
    }

    async deleteBook(bookId: string): Promise<boolean> {
        const db = getDB();
        const booksCollection = db.collection('books');
        const stockCollection = db.collection('bookStocks');

        const bookResult = await booksCollection.deleteOne({ _id: new ObjectId(bookId) });
        await stockCollection.deleteOne({ bookId });

        return bookResult.deletedCount === 1;
    }

    // Helper method to clear all books (for resetting data)
    async clearAllBooks(): Promise<void> {
        const db = getDB();
        await db.collection('books').deleteMany({});
        await db.collection('bookStocks').deleteMany({});
    }

    // Helper method to add initial science books
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
