import express from 'express';
import CartController from '../controllers/CartController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// All cart routes require authentication
router.get('/cart', authenticateToken, CartController.getCart);
router.post('/cart/items', authenticateToken, CartController.addToCart);
router.put('/cart/items/:itemId', authenticateToken, CartController.updateCartItem);
router.delete('/cart/items/:itemId', authenticateToken, CartController.removeFromCart);
router.delete('/cart', authenticateToken, CartController.clearCart);
router.post('/cart/order', authenticateToken, CartController.placeOrder);

export default router;
