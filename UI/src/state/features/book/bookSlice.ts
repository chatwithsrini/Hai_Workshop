import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BookState, CreateBookDTO, UpdateStockDTO } from '../../../types/book.types';
import { bookService } from '../../../services/bookService';

const initialState: BookState = {
    books: [],
    selectedBook: null,
    isLoading: false,
    error: null,
};

// Async thunks
export const fetchAllBooks = createAsyncThunk(
    'book/fetchAll',
    async () => {
        return bookService.getAllBooks();
    }
);

export const fetchBookById = createAsyncThunk(
    'book/fetchById',
    async (bookId: string) => {
        return bookService.getBookById(bookId);
    }
);

export const createBook = createAsyncThunk(
    'book/create',
    async (formData: FormData) => {
        return bookService.createBook(formData);
    }
);

export const updateBook = createAsyncThunk(
    'book/update',
    async ({ id, formData }: { id: string; formData: FormData }) => {
        return bookService.updateBook(id, formData);
    }
);

export const updateBookStock = createAsyncThunk(
    'book/updateStock',
    async ({ id, stockData }: { id: string; stockData: UpdateStockDTO }) => {
        return bookService.updateStock(id, stockData);
    }
);

export const deleteBook = createAsyncThunk(
    'book/delete',
    async (bookId: string) => {
        await bookService.deleteBook(bookId);
        return bookId;
    }
);

const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedBook: (state) => {
            state.selectedBook = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all books
            .addCase(fetchAllBooks.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllBooks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.books = action.payload;
            })
            .addCase(fetchAllBooks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch books';
            })
            // Fetch book by ID
            .addCase(fetchBookById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchBookById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedBook = action.payload;
            })
            .addCase(fetchBookById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch book';
            })
            // Create book
            .addCase(createBook.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createBook.fulfilled, (state, action) => {
                state.isLoading = false;
                state.books.push(action.payload);
            })
            .addCase(createBook.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to create book';
            })
            // Update book
            .addCase(updateBook.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateBook.fulfilled, (state, action) => {
                state.isLoading = false;
                state.books = state.books.map(book =>
                    book.id === action.payload.id ? action.payload : book
                );
                if (state.selectedBook?.id === action.payload.id) {
                    state.selectedBook = action.payload;
                }
            })
            .addCase(updateBook.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to update book';
            })
            // Update book stock
            .addCase(updateBookStock.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateBookStock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.books = state.books.map(book =>
                    book.id === action.payload.id ? action.payload : book
                );
                if (state.selectedBook?.id === action.payload.id) {
                    state.selectedBook = action.payload;
                }
            })
            .addCase(updateBookStock.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to update book stock';
            })
            // Delete book
            .addCase(deleteBook.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteBook.fulfilled, (state, action) => {
                state.isLoading = false;
                state.books = state.books.filter(book => book.id !== action.payload);
                if (state.selectedBook?.id === action.payload) {
                    state.selectedBook = null;
                }
            })
            .addCase(deleteBook.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to delete book';
            });
    },
});

export const { clearError, clearSelectedBook } = bookSlice.actions;
export default bookSlice.reducer;
