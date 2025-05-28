import { Loader2Icon } from "lucide-react";
import MovieCard from "./movie-card";

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

const EndScroll = () => {
  return (
    <div className="text-center py-12">
      <div className="inline-block px-6 py-3 bg-gray-900/50 backdrop-blur-xl rounded-full border border-white/10">
        You've reached the end of the list
      </div>
    </div>
  );
};

interface MovieListProps {
  movies: any[];
  isLoading: boolean;
  hasMore: boolean;
  loadingRef: (node: any) => void;
}

const MovieList = ({
  movies,
  isLoading,
  hasMore,
  loadingRef,
}: MovieListProps) => {
  return (
    <div className="px-12 py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {(isLoading || hasMore) && (
        <div ref={loadingRef} className="flex justify-center py-12">
          {isLoading && (
            <div className="flex items-center gap-2">
              <Loader2Icon className="h-5 w-5 animate-spin" />
            </div>
          )}
        </div>
      )}

      {!isLoading && !hasMore && movies.length > 0 && <EndScroll />}

      {!isLoading && movies.length === 0 && <MovieNotFound />}
    </div>
  );
};
export default MovieList;
