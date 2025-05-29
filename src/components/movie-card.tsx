import { useTMDBConfig } from "@/hooks/use-tmdb-config";
import type { MovieProps } from "@/types/tmdb";
import { StarIcon } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";
import { MoviePosterPlaceholder } from "./movie-poster-placeholder";

type MovieCardProps =
  | { variant?: "default"; movie: MovieProps }
  | { variant: "placeholder"; movie?: undefined };

const MovieCard = (props: MovieCardProps) => {
  const { getPosterUrl } = useTMDBConfig();

  if (props.variant === "placeholder") {
    return (
      <div className="animate-pulse relative h-[350px] rounded-xl overflow-hidden bg-gray-300/20 dark:bg-gray-700/20">
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
  }

  const { movie } = props;

  const posterUrl = getPosterUrl(movie.poster_path, "w342");

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "TBA";

  return (
    <Link
      to={`/movie/${movie.id}`}
      className={`
        group relative h-[350px] rounded-xl overflow-hidden
        transform transition-all duration-500
        hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20
      `}
    >
      {movie.vote_average > 0 && (
        <div className="absolute top-3 right-3 bg-gray-950/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1 z-50">
          <StarIcon className="w-3 h-3 text-amber-300" fill="currentColor" />
          <span className="text-white text-xs font-medium">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      )}
      <div className="absolute inset-0">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} poster`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <MoviePosterPlaceholder
            title={movie.title}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
      </div>

      <div className="absolute inset-0 p-6 flex flex-col justify-end transform transition-transform duration-300">
        <div className="transition-transform duration-300 transform translate-y-16 group-hover:translate-y-0">
          <h3 className="text-lg font-semibold text-white line-clamp-2 min-h-[3.2rem]">
            {movie.title}
          </h3>
          <div className="text-sm text-gray-400 flex flex-wrap gap-x-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>{releaseYear}</span>
            <span>•</span>
            <span>{movie.original_language.toUpperCase()}</span>
          </div>
          <p className="text-sm text-gray-300 line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 min-h-[60px]">
            {movie.overview || "No synopsis available"}
          </p>
        </div>
      </div>
    </Link>
  );
};
export default memo(MovieCard);
