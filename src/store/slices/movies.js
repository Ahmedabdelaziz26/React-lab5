import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../components/axiosConfig/axiosInstance";

export const moviesAction = createAsyncThunk("movies/getAll", async (page) => {
  try {
    const res = await axiosInstance.get(`/movie/popular`, {
      params: { page: page },
    });
    // Check if this logs the movie data
    console.log(res.data.results); 
    return res.data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
});

const moviesSlice = createSlice({
  name: "movies",
  initialState: { movies: [] },
  extraReducers: (builder) => {
    builder.addCase(moviesAction.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
  },
});

export default moviesSlice.reducer;
