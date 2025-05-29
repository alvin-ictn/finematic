import { memo } from "react";
import { MoviePosterPlaceholder } from "./movie-poster-placeholder";

const MovieCardSkeleton = () => {
  return (
    <div
      className="animate-pulse relative h-[350px] rounded-xl overflow-hidden bg-gray-300/20 dark:bg-gray-700/20"
      data-testid="movie-card-skeleton"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
        <MoviePosterPlaceholder
          title={"Movie"}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute bottom-0 p-6 w-full space-y-3">
        <div className="h-5 bg-gray-400/30 rounded w-3/4" />
        <div className="h-4 bg-gray-400/20 rounded w-1/2" />
        <div className="h-4 bg-gray-400/20 rounded w-full" />
        <div className="h-4 bg-gray-400/20 rounded w-5/6" />
      </div>
    </div>
  );
};

export default memo(MovieCardSkeleton);
