import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './favoritesSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;