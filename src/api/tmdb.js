import axios from "axios";

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
});

export const getPopularMovies = (page, signal) =>
  tmdb
    .get("/movie/popular", { params: { page }, signal })
    .then((res) => res.data.results);

export const searchMovies = (query, page, signal) =>
  tmdb
    .get("/search/movie", { params: { query, page }, signal })
    .then((res) => res.data.results);
