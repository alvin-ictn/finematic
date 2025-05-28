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
  params: { api_key: API_KEY },
});

export const getMoviesByCategory = async (category: string, page = 1) => {
  const categories: Record<string, string> = {
    'now_playing': '/movie/now_playing',
    'popular': '/movie/popular',
    'top_rated': '/movie/top_rated',
    'upcoming': '/movie/upcoming',
  }
  const endpoint = categories[category] || categories.popular
  const response = await tmbd.get(endpoint, {
    params: { page },
  })
  return response.data
}

export const searchMovies = async (query: string, page = 1) => {
  const response = await tmbd.get('/search/movie', {
    params: {
      query,
      page,
    },
  })
  return response.data
}

export const getMovieDetails = async (id: string) => {
  const response = await tmbd.get(`/movie/${id}`, {
    params: {
      append_to_response: 'credits',
    },
  })
  return response.data
}