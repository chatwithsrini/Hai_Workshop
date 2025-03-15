import { Request, Response } from 'express';
import BookService from '../services/BookService';

class BookController {
    // POST: Create a new book (Admin only)
    async createBook(req: Request, res: Response) {
        try {
            const bookData = req.body;
            const requiredFields = [
                'title', 'description', 'author', 'category',
                'isbn', 'publisher', 'publishedYear', 'initialStock', 'price'
            ];

            const missingFields = requiredFields.filter(field => !bookData[field]);
            if (missingFields.length > 0) {
                return res.status(400).json({ 
                    error: `Missing required fields: ${missingFields.join(', ')}` 
                });
            }

            // Validate and convert numeric fields
            const publishedYear = parseInt(bookData.publishedYear);
            const initialStock = parseInt(bookData.initialStock);
            const price = parseFloat(bookData.price);

            if (isNaN(publishedYear) || publishedYear <= 0) {
                return res.status(400).json({ error: 'Invalid publishedYear value' });
            }
            if (isNaN(initialStock) || initialStock < 0) {
                return res.status(400).json({ error: 'Invalid initialStock value' });
            }
            if (isNaN(price) || price < 0) {
                return res.status(400).json({ error: 'Invalid price value' });
            }

            // Update the values in bookData
            bookData.publishedYear = publishedYear;
            bookData.initialStock = initialStock;
            bookData.price = price;

            // Handle the uploaded file
            if (req.file) {
                const imageUrl = `/uploads/${req.file.filename}`;
                bookData.imageUrl = imageUrl;
            }

            const newBook = await BookService.createBook(bookData);
            res.status(201).json(newBook);
        } catch (error) {
            console.error('Error creating book:', error);
            res.status(500).json({ error: 'Failed to create book' });
        }
    }

    // GET: Get all books
    async getAllBooks(req: Request, res: Response) {
        try {
            const books = await BookService.getAllBooks();
            res.status(200).json(books);
        } catch (error) {
            console.error('Error retrieving books:', error);
            res.status(500).json({ error: 'Failed to retrieve books' });
        }
    }

    // GET: Get a book by ID
    async getBookById(req: Request, res: Response) {
        try {
            const bookId = req.params.id;
            const book = await BookService.getBookById(bookId);
            
            if (book) {
                res.status(200).json(book);
            } else {
                res.status(404).json({ error: 'Book not found' });
            }
        } catch (error) {
            console.error('Error retrieving book:', error);
            res.status(500).json({ error: 'Failed to retrieve book' });
        }
    }

    // PUT: Update book stock (Admin only)
    async updateStock(req: Request, res: Response) {
        try {
            const bookId = req.params.id;
            const quantity = parseInt(req.body.quantity);

            if (isNaN(quantity) || quantity < 0) {
                return res.status(400).json({ error: 'Invalid quantity value' });
            }

            const updatedBook = await BookService.updateStock(bookId, { quantity });
            
            if (updatedBook) {
                res.status(200).json(updatedBook);
            } else {
                res.status(404).json({ error: 'Book not found' });
            }
        } catch (error) {
            console.error('Error updating book stock:', error);
            res.status(500).json({ error: 'Failed to update book stock' });
        }
    }

    // PUT: Update a book (Admin only)
    async updateBook(req: Request, res: Response) {
        try {
            const bookId = req.params.id;
            const updateData = { ...req.body };

            // Validate the update data
            const allowedFields = [
                'title', 'description', 'author', 'category',
                'isbn', 'publisher', 'publishedYear', 'price',
                'imageUrl', 'stock', 'quantity'
            ];
            
            const invalidFields = Object.keys(updateData).filter(
                field => !allowedFields.includes(field)
            );

            if (invalidFields.length > 0) {
                return res.status(400).json({ 
                    error: `Invalid fields: ${invalidFields.join(', ')}` 
                });
            }

            // Handle the uploaded file
            if (req.file) {
                const imageUrl = `/uploads/${req.file.filename}`;
                updateData.imageUrl = imageUrl;
            }

            // Validate and convert numeric fields if present
            if ('publishedYear' in updateData) {
                const publishedYear = parseInt(updateData.publishedYear);
                if (isNaN(publishedYear) || publishedYear <= 0) {
                    return res.status(400).json({ error: 'Invalid publishedYear value' });
                }
                updateData.publishedYear = publishedYear;
            }

            if ('price' in updateData) {
                const price = parseFloat(updateData.price);
                if (isNaN(price) || price < 0) {
                    return res.status(400).json({ error: 'Invalid price value' });
                }
                updateData.price = price;
            }

            if ('stock' in updateData) {
                const stock = parseInt(updateData.stock);
                if (isNaN(stock) || stock < 0) {
                    return res.status(400).json({ error: 'Invalid stock value' });
                }
                updateData.stock = stock;
            }

            if ('quantity' in updateData) {
                const quantity = parseInt(updateData.quantity);
                if (isNaN(quantity) || quantity < 0) {
                    return res.status(400).json({ error: 'Invalid quantity value' });
                }
                updateData.quantity = quantity;
            }

            const updatedBook = await BookService.updateBook(bookId, updateData);
            
            if (updatedBook) {
                res.status(200).json(updatedBook);
            } else {
                res.status(404).json({ error: 'Book not found' });
            }
        } catch (error) {
            console.error('Error updating book:', error);
            res.status(500).json({ error: 'Failed to update book' });
        }
    }

    async deleteBook(req: Request, res: Response) {
        try {
            const bookId = req.params.id;
            const deleted = await BookService.deleteBook(bookId);
            
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Book not found' });
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            res.status(500).json({ error: 'Failed to delete book' });
        }
    }

    // POST: Reset and initialize books (Admin only)
    async resetAndInitializeBooks(req: Request, res: Response) {
        try {
            await BookService.clearAllBooks();
            await BookService.addInitialBooks();
            res.status(200).json({ message: 'Books reset and initialized successfully' });
        } catch (error) {
            console.error('Error resetting books:', error);
            res.status(500).json({ error: 'Failed to reset and initialize books' });
        }
    }
}

export default new BookController();
