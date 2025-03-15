import express from 'express';
import BookController from '../controllers/BookController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

// Public routes
router.get('/books', authenticateToken, BookController.getAllBooks);
router.get('/books/:id', authenticateToken, BookController.getBookById);

// Admin only routes
router.post('/books', 
    authenticateToken, 
    isAdmin, 
    upload.single('image'), // Handle single image upload
    BookController.createBook
);
router.put('/books/:id', authenticateToken, isAdmin, upload.single('image'), BookController.updateBook);
router.put('/books/:id/stock', authenticateToken, isAdmin, BookController.updateStock);
router.delete('/books/:id', authenticateToken, isAdmin, BookController.deleteBook);

// Admin utility routes
router.post('/books/reset', authenticateToken, isAdmin, BookController.resetAndInitializeBooks);

export default router;
