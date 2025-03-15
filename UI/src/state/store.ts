import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import bookReducer from './features/book/bookSlice';
import cartReducer from './features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    book: bookReducer,
    cart: cartReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
