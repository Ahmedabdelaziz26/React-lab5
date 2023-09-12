import { configureStore } from "@reduxjs/toolkit";
import favoriteReducer from "./slices/favorite";
import loaderReducer from "./slices/loader";
import moviesReducer from "./slices/movies";

const store = configureStore({
  reducer: {
    favorite: favoriteReducer,
    loader: loaderReducer,
    movies: moviesReducer
  },
});

export default store;
