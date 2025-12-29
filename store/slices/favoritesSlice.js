import { createSlice } from '@reduxjs/toolkit';

const loadFavoritesFromStorage = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('redux_favorites');
    return saved ? JSON.parse(saved) : [];
  }
  return [];
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: loadFavoritesFromStorage(),
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const itemId = action.payload;
      const index = state.items.findIndex((id) => id === itemId);
      
      if (index === -1) {
        state.items.push(itemId);
      } else {
        state.items.splice(index, 1);
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('redux_favorites', JSON.stringify(state.items));
      }
    },
    clearFavorites: (state) => {
      state.items = [];
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('redux_favorites', JSON.stringify(state.items));
      }
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;

export const selectFavorites = (state) => state.favorites.items;
export const selectIsFavorite = (state, itemId) => 
  state.favorites.items.includes(itemId);

export default favoritesSlice.reducer;

