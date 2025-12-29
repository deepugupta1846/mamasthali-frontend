import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('redux_cart');
    return saved ? JSON.parse(saved) : [];
  }
  return [];
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
  },
  reducers: {
    addToCart: (state, action) => {
      const { item, quantity = 1 } = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...item, quantity });
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('redux_cart', JSON.stringify(state.items));
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('redux_cart', JSON.stringify(state.items));
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('redux_cart', JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('redux_cart', JSON.stringify(state.items));
      }
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => 
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectCartTotal = (state) => 
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;

