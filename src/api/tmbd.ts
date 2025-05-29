import { categoriesEndpoint } from "@/constants/category";
import type {
  ConfigResponseProps,
  CreditsProps,
  MovieListResponseProps,
  MovieProps,
} from "@/types/tmdb";
import axios, { type AxiosInstance, type AxiosResponse } from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

if (!API_KEY) {
  console.error(
    "TMDB API Key is not set. Please set VITE_TMDB_API_KEY in your .env file."
  );
}

const tmdb: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
});

export const getConfiguration = async (): Promise<ConfigResponseProps> => {
  try {
    const response: AxiosResponse<ConfigResponseProps> = await tmdb.get(
      "/configuration"
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch configuration", error);

    throw error;
  }
};

export const getMoviesByCategory = async (
  category: string,
  page = 1
): Promise<MovieListResponseProps<MovieProps>> => {
  try {
    const endpoint = categoriesEndpoint[category] || categoriesEndpoint.popular;
    const response: AxiosResponse<MovieListResponseProps<MovieProps>> =
      await tmdb.get(endpoint, {
        params: { page },
      });

    return response.data;
  } catch (error) {
    console.error(`Failed to fetch movies in category "${category}"`, error);

    throw error;
  }
};

export const searchMovies = async (
  query: string,
  page = 1
): Promise<MovieListResponseProps<MovieProps>> => {
  try {
    const response: AxiosResponse<MovieListResponseProps<MovieProps>> =
      await tmdb.get("/search/movie", {
        params: { query, page },
      });

    return response.data;
  } catch (error) {
    console.error(`Failed to search movies with query "${query}"`, error);

    throw error;
  }
};

export const getMovieDetails = async (id: string) => {
  try {
    const response = await tmdb.get(`/movie/${id}`);
    console.log("ID", id, response);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch movie details for ID "${id}"`, error);

    throw {
      error: error,
      id: id,
      custom_message: `Failed to fetch movie details for ID "${id}"`,
    };
  }
};

export const getMovieCredits = async (id: string) => {
  try {
    const response = await tmdb.get<CreditsProps>(`/movie/${id}/credits`);

    return response.data;
  } catch (error) {
    console.error(`Failed to fetch movie credits for ID "${id}"`, error);

    throw error;
  }
};
