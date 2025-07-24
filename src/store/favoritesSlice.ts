import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  list: string[];
}

const initialState: FavoritesState = {
  list: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<string>) {
      state.list.push(action.payload);
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.list = state.list.filter((id) => id !== action.payload);
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;