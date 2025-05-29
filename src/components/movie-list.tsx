import MovieCard from "./movie-card";
import type { MovieProps } from "@/types/tmdb";
import { LoadingSpinner } from "./loading-spinner";

const MovieNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="text-center">
        <p className="text-2xl font-semibold text-gray-400 mb-2">
          No movies found
        </p>
        <p className="text-gray-500">Try adjusting your search or category</p>
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
  if (movies.length === 0) {
    return (
      <div className="px-12 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 20 }).map((_, index) => (
            <MovieCard key={`placeholder-${index}`} variant="placeholder" />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="px-12 py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={`${movie.fromPage}-${movie.id}-${movie.title}`}
            movie={movie}
          />
        ))}
      </div>

      {(isLoading || hasMore) && (
        <div ref={loadingRef} className="flex justify-center py-12">
          {isLoading && <LoadingSpinner />}
        </div>
      )}

      {!isLoading && movies.length === 0 && <MovieNotFound />}
    </div>
  );
};
export default MovieList;
