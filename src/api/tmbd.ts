import { categoriesEndpoint } from "@/constants/category";
import axios, { type AxiosInstance } from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

if (!API_KEY) {
  console.error(
    "TMDB API Key is not set. Please set VITE_TMDB_API_KEY in your .env file."
  );
}

const tmbd: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`
  }
});

export const getMoviesByCategory = async (category: string, page = 1) => {
  const endpoint = categoriesEndpoint[category] || categoriesEndpoint.popular;
  const response = await tmbd.get(endpoint, {
    params: { page },
  });
  return response.data;
};

export const searchMovies = async (query: string, page = 1) => {
  const response = await tmbd.get("/search/movie", {
    params: {
      query,
      page,
    },
  });
  return response.data;
};

export const getMovieDetails = async (id: string) => {
  const response = await tmbd.get(`/movie/${id}`, {
    params: {
      append_to_response: "credits",
    },
  });
  return response.data;
};
