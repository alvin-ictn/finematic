import { Link } from "react-router-dom";
import { StarIcon, CalendarIcon } from "lucide-react";

interface MovieCardProps {
  movie: any;
}
const MovieCard = ({ movie }: MovieCardProps) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";
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
      <div className="absolute inset-0">
        <img
          src={posterUrl}
          alt={`${movie.title} poster`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
      </div>

      <div className="absolute inset-0 p-6 flex flex-col justify-end transform transition-transform duration-300">
        <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-2 mb-2">
            <StarIcon className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">
              {movie.vote_average.toFixed(1)}
            </span>
            <span className="mx-2 text-white/30">•</span>
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-300">{releaseYear}</span>
          </div>
          <h3 className="text-lg font-semibold line-clamp-1 mb-2">
            {movie.title}
          </h3>
          <p className="text-sm text-gray-300 line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {movie.overview}
          </p>
        </div>
      </div>
    </Link>
  );
};
export default MovieCard;
