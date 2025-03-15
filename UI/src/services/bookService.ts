import axios from '../utils/axios.utils';
import { Book, CreateBookDTO, UpdateStockDTO } from '../types/book.types';

export const bookService = {
    getAllBooks: async (): Promise<Book[]> => {
        try {
            const response = await axios.get('/books');
            return response.data;
        } catch (error) {
            console.error('Error fetching books:', error);
            throw error;
        }
    },

    getBookById: async (id: string): Promise<Book> => {
        try {
            const response = await axios.get(`/books/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching book:', error);
            throw error;
        }
    },

    createBook: async (formData: FormData): Promise<Book> => {
        try {
            const response = await axios.post('/books', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating book:', error);
            throw error;
        }
    },

    updateBook: async (id: string, formData: FormData): Promise<Book> => {
        try {
            const response = await axios.put(`/books/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating book:', error);
            throw error;
        }
    },

    updateStock: async (id: string, stockData: UpdateStockDTO): Promise<Book> => {
        try {
            const response = await axios.put(`/books/${id}/stock`, stockData);
            return response.data;
        } catch (error) {
            console.error('Error updating book stock:', error);
            throw error;
        }
    },

    deleteBook: async (id: string): Promise<void> => {
        try {
            await axios.delete(`/books/${id}`);
        } catch (error) {
            console.error('Error deleting book:', error);
            throw error;
        }
    }
};
