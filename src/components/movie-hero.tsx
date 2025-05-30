import { useTMDBConfig } from "@/hooks/use-tmdb-config";
import type { MovieProps } from "@/types/tmdb";
import { Calendar, Info, Star } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface MovieHeroProps {
  movie: MovieProps;
}

export const MovieHero: React.FC<MovieHeroProps> = ({ movie }) => {
  const { getBackdropUrl } = useTMDBConfig();
  const navigate = useNavigate();

  const backdropUrl = getBackdropUrl(movie.backdrop_path, "w1280");
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "";

  return (
    <div
      className="relative h-screen overflow-hidden"
      data-testid="movie-hero-container"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backdropUrl})`,
        }}
        data-testid="movie-hero-backdrop"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />

      <div className="relative z-10 h-full flex items-center">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="max-w-2xl">
            <h1
              className="heading-font text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 animate-fade-in"
              data-testid="movie-hero-title"
            >
              {movie.title}
            </h1>

            <div
              className="flex items-center space-x-6 mb-6 animate-fade-in"
              style={{ animationDelay: "200ms" }}
              data-testid="movie-hero-meta-info"
            >
              {movie.vote_average > 0 && (
                <div
                  className="flex items-center space-x-2"
                  data-testid="movie-hero-rating"
                >
                  <Star
                    className="w-5 h-5 text-amber-300"
                    fill="currentColor"
                    data-testid="star-icon"
                  />
                  <span
                    className="text-white font-medium text-lg"
                    data-testid="movie-hero-vote-average"
                  >
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span
                    className="text-gray-300 text-sm"
                    data-testid="movie-hero-vote-count"
                  >
                    ({movie.vote_count.toLocaleString()} votes)
                  </span>
                </div>
              )}

              {releaseYear && (
                <div
                  className="flex items-center space-x-2 text-gray-300"
                  data-testid="movie-hero-release-year"
                >
                  <Calendar className="w-4 h-4" data-testid="calendar-icon" />
                  <span>{releaseYear}</span>
                </div>
              )}
            </div>

            <p
              className="text-gray-200 text-lg leading-relaxed mb-8 animate-fade-in max-w-xl"
              style={{ animationDelay: "400ms" }}
              data-testid="movie-hero-overview"
            >
              {movie.overview || "No description available."}
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 animate-fade-in"
              style={{ animationDelay: "600ms" }}
              data-testid="movie-hero-actions"
            >
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/movie/${movie.id}`)}
                data-testid="more-info-button"
              >
                <Info className="w-5 h-5 mr-2" data-testid="info-icon" />
                More Info
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-10 right-10 animate-float"
        data-testid="floating-element-1"
      >
        <div className="w-2 h-2 bg-amber-300 rounded-full opacity-60"></div>
      </div>
      <div
        className="absolute top-1/3 right-1/4 animate-float"
        style={{ animationDelay: "1s" }}
        data-testid="floating-element-2"
      >
        <div className="w-1 h-1 bg-white rounded-full opacity-40"></div>
      </div>
    </div>
  );
};
