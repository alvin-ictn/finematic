import { mockConfigResponse } from "@/__mocks__/movie-config";
import {
  mockCredits,
  mockMovieDetails,
  mockMovieListResponse,
} from "@/__mocks__/movie-data";
import {
  getConfiguration,
  getMovieCredits,
  getMovieDetails,
  getMoviesByCategory,
  searchMovies,
  tmdb,
} from "@/api/tmbd";

const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

jest.mock("@/constants/category", () => ({
  categoriesEndpoint: {
    popular: "/movie/popular",
    top_rated: "/movie/top_rated",
    upcoming: "/movie/upcoming",
    now_playing: "/movie/now_playing",
  },
}));

jest.mock("axios", () => {
  return {
    ...(jest.requireActual("axios") as object),
    create: jest.fn().mockReturnValue(jest.requireActual("axios")),
  };
});

describe("TMDB API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockClear();
  });

  describe("getConfiguration", () => {
    it("should fetch configuration successfully", async () => {
      tmdb.get = jest.fn().mockResolvedValueOnce({
        data: mockConfigResponse,
      });
      const result = await getConfiguration();

      expect(tmdb.get).toHaveBeenCalledWith("/configuration");
      expect(result).toEqual(mockConfigResponse);
    });

    it("should return correct image configuration structure", async () => {
      tmdb.get = jest.fn().mockResolvedValueOnce({
        data: mockConfigResponse,
      });

      const result = await getConfiguration();

      expect(result.images).toHaveProperty("base_url");
      expect(result.images).toHaveProperty("secure_base_url");
      expect(result.images).toHaveProperty("backdrop_sizes");
      expect(result.images).toHaveProperty("poster_sizes");
      expect(Array.isArray(result.images.poster_sizes)).toBe(true);
    });
  });

  describe("getMoviesByCategory", () => {
    it("should fetch movies by category successfully", async () => {
      tmdb.get = jest.fn().mockResolvedValueOnce({
        data: mockMovieListResponse,
      });

      const result = await getMoviesByCategory("popular");

      expect(tmdb.get).toHaveBeenCalledWith("/movie/popular", {
        params: { page: 1 },
      });
      expect(result).toEqual(mockMovieListResponse);
    });

    it("should fetch movies with custom page number", async () => {
      tmdb.get = jest.fn().mockResolvedValueOnce({
        data: mockMovieListResponse,
      });

      await getMoviesByCategory("top_rated", 3);

      expect(tmdb.get).toHaveBeenCalledWith("/movie/top_rated", {
        params: { page: 3 },
      });
    });

    it("should default to popular category for unknown category", async () => {
      tmdb.get = jest.fn().mockResolvedValueOnce({
        data: mockMovieListResponse,
      });

      await getMoviesByCategory("unknown_category");

      expect(tmdb.get).toHaveBeenCalledWith("/movie/popular", {
        params: { page: 1 },
      });
    });

    it("should handle movies fetch error", async () => {
      const error = new Error("API error");
      tmdb.get = jest.fn().mockRejectedValueOnce(error);

      await expect(getMoviesByCategory("popular")).rejects.toThrow("API error");
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to fetch movies in category "popular"',
        error
      );
    });

    it("should return proper movie list structure", async () => {
      tmdb.get = jest.fn().mockResolvedValueOnce({
        data: mockMovieListResponse,
      });

      const result = await getMoviesByCategory("popular");

      expect(result).toHaveProperty("page");
      expect(result).toHaveProperty("results");
      expect(result).toHaveProperty("total_pages");
      expect(result).toHaveProperty("total_results");
      expect(Array.isArray(result.results)).toBe(true);
      expect(result.results[0]).toHaveProperty("id");
      expect(result.results[0]).toHaveProperty("title");
    });
  });

  describe("searchMovies", () => {
    it("should search movies successfully", async () => {
      tmdb.get = jest.fn().mockResolvedValueOnce({
        data: mockMovieListResponse,
      });

      const result = await searchMovies("test query");

      expect(tmdb.get).toHaveBeenCalledWith("/search/movie", {
        params: { query: "test query", page: 1 },
      });
      expect(result).toEqual(mockMovieListResponse);
    });

    it("should search movies with custom page", async () => {
      tmdb.get = jest.fn().mockResolvedValueOnce({
        data: mockMovieListResponse,
      });

      await searchMovies("action movies", 2);

      expect(tmdb.get).toHaveBeenCalledWith("/search/movie", {
        params: { query: "action movies", page: 2 },
      });
    });

    it("should handle search error", async () => {
      const error = new Error("Search failed");
      tmdb.get = jest.fn().mockRejectedValueOnce(error);

      await expect(searchMovies("test")).rejects.toThrow("Search failed");
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to search movies with query "test"',
        error
      );
    });

    it("should handle empty search query", async () => {
      tmdb.get = jest.fn().mockResolvedValueOnce({
        data: { ...mockMovieListResponse, results: [] },
      });

      const result = await searchMovies("");

      expect(tmdb.get).toHaveBeenCalledWith("/search/movie", {
        params: { query: "", page: 1 },
      });
      expect(result.results).toEqual([]);
    });
  });

  describe("getMovieDetails", () => {
    it("should fetch movie details successfully", async () => {
      tmdb.get = jest.fn().mockResolvedValueOnce({
        data: mockMovieDetails,
      });

      const result = await getMovieDetails("123456");
      expect(tmdb.get).toHaveBeenCalledWith("/movie/123456");
      expect(result).toEqual(mockMovieDetails);
    });

    it("should handle movie details fetch error", async () => {
      const error = new Error("Movie not found");
      tmdb.get = jest.fn().mockRejectedValueOnce(error);

      try {
        await getMovieDetails("999999");
      } catch (thrownError: unknown) {
        const err = thrownError as {
          error: Error;
          id: string;
          custom_message?: string;
        };
        expect(err).toHaveProperty("error", error);
        expect(err).toHaveProperty("id", "999999");
        expect(err).toHaveProperty("custom_message");
        expect(err.custom_message).toContain("999999");
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to fetch movie details for ID "999999"',
        error
      );
    });
  });

  describe("getMovieCredits", () => {
    it("should fetch movie credits successfully", async () => {
      tmdb.get = jest.fn().mockResolvedValueOnce({
        data: mockCredits,
      });

      const result = await getMovieCredits("123456");

      expect(tmdb.get).toHaveBeenCalledWith("/movie/123456/credits");
      expect(result).toEqual(mockCredits);
    });

    it("should handle credits fetch error", async () => {
      const error = new Error("Credits not found");
      tmdb.get = jest.fn().mockRejectedValueOnce(error);

      await expect(getMovieCredits("999999")).rejects.toThrow(
        "Credits not found"
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to fetch movie credits for ID "999999"',
        error
      );
    });

    it("should return proper credits structure", async () => {
      tmdb.get = jest.fn().mockResolvedValueOnce({
        data: mockCredits,
      });

      const result = await getMovieCredits("123456");

      expect(result).toHaveProperty("cast");
      expect(result).toHaveProperty("crew");
      expect(Array.isArray(result.cast)).toBe(true);
      expect(Array.isArray(result.crew)).toBe(true);

      if (result.cast.length > 0) {
        expect(result.cast[0]).toHaveProperty("id");
        expect(result.cast[0]).toHaveProperty("name");
        expect(result.cast[0]).toHaveProperty("character");
      }

      if (result.crew.length > 0) {
        expect(result.crew[0]).toHaveProperty("id");
        expect(result.crew[0]).toHaveProperty("name");
        expect(result.crew[0]).toHaveProperty("job");
        expect(result.crew[0]).toHaveProperty("department");
      }
    });
  });
});
