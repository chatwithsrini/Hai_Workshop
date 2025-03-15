import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CartState, IAddToCartDTO, IUpdateCartItemDTO } from '../../../types/cart.types';
import { cartService } from '../../../services/cartService';

const initialState: CartState = {
    cart: null,
    loading: false,
    error: null,
};

export const fetchCart = createAsyncThunk(
    'cart/fetch',
    async () => {
        return cartService.getCart();
    }
);

export const addToCart = createAsyncThunk(
    'cart/addItem',
    async (data: IAddToCartDTO) => {
        return cartService.addToCart(data);
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateItem',
    async ({ itemId, data }: { itemId: string; data: IUpdateCartItemDTO }) => {
        return cartService.updateCartItem(itemId, data);
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeItem',
    async (itemId: string) => {
        return cartService.removeFromCart(itemId);
    }
);

export const clearCart = createAsyncThunk(
    'cart/clear',
    async () => {
        await cartService.clearCart();
    }
);

export const placeOrder = createAsyncThunk(
    'cart/placeOrder',
    async () => {
        return cartService.placeOrder();
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch cart';
            })
            // Add to cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to add item to cart';
            })
            // Update cart item
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update cart item';
            })
            // Remove from cart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to remove item from cart';
            })
            // Clear cart
            .addCase(clearCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.loading = false;
                state.cart = null;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to clear cart';
            })
            // Place order
            .addCase(placeOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(placeOrder.fulfilled, (state) => {
                state.loading = false;
                state.cart = null;
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to place order';
            });
    },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
