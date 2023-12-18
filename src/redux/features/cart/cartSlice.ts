import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      localStorage.setItem('cartItems', JSON.stringify(state.items)); // Update local storage
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.items)); // Update local storage
    },
    incrementItem: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex((item: any) => item.items.productId === action.payload);
      if (index !== -1) {
        state.items[index].quantity += 1;
        localStorage.setItem('cartItems', JSON.stringify(state.items)); // Update local storage
      }
    },
    decrementItem: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex((item: any) => item.items.productId === action.payload);
      if (index !== -1 && state.items[index].quantity > 1) {
        state.items[index].quantity -= 1;
        localStorage.setItem('cartItems', JSON.stringify(state.items)); // Update local storage
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      // Use filter based on the inner productId
      const updatedItems = state.items.filter((item: any) => item.items.productId !== action.payload);

      // Update state with the new array
      state.items = updatedItems;

      // Update localStorage
      setTimeout(() => {
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      }, 1000)

    },
    // New action for updating cart item
    updateCartItem: (state, action: PayloadAction<{ productId: string; action: 'increment' | 'decrement' }>) => {
      const { productId, action: updateAction } = action.payload;
      const index = state.items.findIndex((item) => item.productId === productId);

      if (index !== -1) {
        if (updateAction === 'increment') {
          state.items[index].quantity += 1;
        } else if (updateAction === 'decrement' && state.items[index].quantity > 1) {
          state.items[index].quantity -= 1;
        }
        localStorage.setItem('cartItems', JSON.stringify(state.items));
      }
    },
  },
});

export const { setCartItems, addToCart, incrementItem, decrementItem, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
