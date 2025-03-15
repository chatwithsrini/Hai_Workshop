import axios from '../utils/axios.utils';
import { ICartWithBooks, IAddToCartDTO, IUpdateCartItemDTO } from '../types/cart.types';

export const cartService = {
    getCart: async (): Promise<ICartWithBooks> => {
        try {
            const response = await axios.get('/cart');
            return response.data;
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw error;
        }
    },

    addToCart: async (data: IAddToCartDTO): Promise<ICartWithBooks> => {
        try {
            const response = await axios.post('/cart/items', data);
            return response.data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    },

    updateCartItem: async (itemId: string, data: IUpdateCartItemDTO): Promise<ICartWithBooks> => {
        try {
            const response = await axios.put(`/cart/items/${itemId}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    },

    removeFromCart: async (itemId: string): Promise<ICartWithBooks> => {
        try {
            const response = await axios.delete(`/cart/items/${itemId}`);
            return response.data;
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    },

    clearCart: async (): Promise<void> => {
        try {
            await axios.delete('/cart');
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    },

    placeOrder: async (): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await axios.post('/cart/order');
            return response.data;
        } catch (error) {
            console.error('Error placing order:', error);
            throw error;
        }
    }
};
