import MovieCard from "./movie-card";
import type { MovieProps } from "@/types/tmdb";
import { LoadingSpinner } from "./loading-spinner";

const MovieNotFound = () => {
  return (
    <div
      className="flex flex-col items-center justify-center py-32"
      data-testid="movie-not-found"
    >
      <div className="text-center">
        <p
          className="text-2xl font-semibold text-gray-400 mb-2"
          data-testid="not-found-title"
        >
          No movies found
        </p>
        <p className="text-gray-500" data-testid="not-found-subtitle">
          Try adjusting your search or category
        </p>
      </div>
    </div>
  );
};

interface MovieListProps {
  movies: (MovieProps & { fromPage: number })[];
  isLoading: boolean;
  hasMore: boolean;
  loadingRef: (node: HTMLElement | null) => void;
}

const MovieList = ({
  movies,
  isLoading,
  hasMore,
  loadingRef,
}: MovieListProps) => {
  if (movies.length === 0 && isLoading) {
    return (
      <div className="px-12 py-8" data-testid="movie-list-loading-placeholder">
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          data-testid="placeholder-grid"
        >
          {Array.from({ length: 20 }).map((_, index) => (
            <MovieCard
              key={`placeholder-${index}`}
              variant="placeholder"
              data-testid={`movie-card-placeholder-${index}`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-12 py-8" data-testid="movie-list-container">
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        data-testid="movie-list-grid"
      >
        {movies.map((movie) => (
          <MovieCard
            key={`${movie.fromPage}-${movie.id}-${movie.title}`}
            movie={movie}
          />
        ))}
      </div>

      {(isLoading || hasMore) && (
        <div
          ref={loadingRef}
          className="flex justify-center py-12"
          data-testid="movie-list-loading-indicator"
        >
          {isLoading && <LoadingSpinner data-testid="loading-spinner" />}
        </div>
      )}

      {!isLoading && movies.length === 0 && <MovieNotFound />}
    </div>
  );
};

export default MovieList;
