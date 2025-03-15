import { Request, Response } from 'express';
import CartService from '../services/CartService';
import { OrderResult } from '../models/ICart';

class CartController {
    // GET: Get user's cart
    async getCart(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }

            const cart = await CartService.getCart(userId);
            res.status(200).json(cart);
        } catch (error) {
            console.error('Error retrieving cart:', error);
            res.status(500).json({ error: 'Failed to retrieve cart' });
        }
    }

    // POST: Add item to cart
    async addToCart(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }

            const { bookId, quantity } = req.body;
            if (!bookId || typeof quantity !== 'number' || quantity <= 0) {
                return res.status(400).json({ error: 'Invalid request data' });
            }

            const cart = await CartService.addToCart(userId, { bookId, quantity });
            res.status(200).json(cart);
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ error: 'Failed to add item to cart' });
        }
    }

    // PUT: Update cart item quantity
    async updateCartItem(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }

            const itemId = req.params.itemId;
            const { quantity } = req.body;
            if (typeof quantity !== 'number' || quantity < 0) {
                return res.status(400).json({ error: 'Invalid quantity' });
            }

            const cart = await CartService.updateCartItem(userId, itemId, { quantity });
            res.status(200).json(cart);
        } catch (error) {
            console.error('Error updating cart item:', error);
            res.status(500).json({ error: 'Failed to update cart item' });
        }
    }

    // DELETE: Remove item from cart
    async removeFromCart(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }

            const itemId = req.params.itemId;
            const cart = await CartService.removeFromCart(userId, itemId);
            res.status(200).json(cart);
        } catch (error) {
            console.error('Error removing from cart:', error);
            res.status(500).json({ error: 'Failed to remove item from cart' });
        }
    }

    // DELETE: Clear cart
    async clearCart(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }

            await CartService.clearCart(userId);
            res.status(204).send();
        } catch (error) {
            console.error('Error clearing cart:', error);
            res.status(500).json({ error: 'Failed to clear cart' });
        }
    }

    // POST: Place order and reduce stock
    async placeOrder(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }

            const result = await CartService.placeOrder(userId);
            
            if (!result.success) {
                return res.status(400).json({ error: result.message });
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error placing order:', error);
            res.status(500).json({ error: 'Failed to place order' });
        }
    }
}

export default new CartController();
