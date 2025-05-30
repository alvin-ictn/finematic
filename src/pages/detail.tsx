import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, CalendarIcon, ClockIcon, StarIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getMovieCredits, getMovieDetails } from "@/api/tmbd";
import { LoadingSpinner } from "@/components/loading-spinner";
import { MoviePosterPlaceholder } from "@/components/fallback/movie-poster-placeholder";
import { useTMDBConfig } from "@/hooks/use-tmdb-config";
import { type MovieDetailsProps } from "@/types/tmdb";
import { useErrorBoundary } from "react-error-boundary";

const MovieDetail: React.FC = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const { showBoundary } = useErrorBoundary();

  const navigate = useNavigate();
  const [showFullOverview, setShowFullOverview] = useState(false);

  const { getBackdropUrl, getPosterUrl, getProfileUrl } = useTMDBConfig();
  const {
    data: movie,
    isLoading: isLoadingMovie,
    isError: isErrorMovie,
    error,
  } = useQuery<MovieDetailsProps, Error, MovieDetailsProps>({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(id!),
    retry: 2,
    enabled: !!id,
  });

  const {
    data: credits,
    isLoading: isLoadingCredits,
    isError: isErrorCredits,
  } = useQuery({
    queryKey: ["credits", id],
    queryFn: () => getMovieCredits(id!),
    enabled: !!id && !isErrorMovie && !isLoadingMovie,
    throwOnError: true,
  });

  const isLoading = isLoadingMovie || isLoadingCredits;
  const isError = isErrorMovie || isErrorCredits;

  const director = credits?.crew.find((person) => person.job === "Director");

  const topCast = credits?.cast.slice(0, 6) || [];
  const backdropUrl = getBackdropUrl(movie?.backdrop_path ?? null, "original");
  const posterUrl = getPosterUrl(movie?.poster_path ?? null, "w500");
  const directorUrl = getProfileUrl(director?.profile_path ?? null, "w185");

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || movie === undefined) {
    showBoundary(error);
    return <div></div>;
  }

  return (
    <div className="bg-gray-950 min-h-screen" data-testid="detail-page">
      <div className="relative w-full h-[50vh] md:h-[70vh]">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${backdropUrl})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent"></div>
        </div>
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => navigate("/")}
            className="rounded-xl py-2 px-5 text-base font-medium bg-gray-950 text-input flex items-center gap-2 justify-center cursor-pointer hover:opacity-90 border border-foreground hover:border-border"
          >
            <ArrowLeftIcon size={16} className="mr-2" />
            Back
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-32 md:-mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-64 mx-auto md:mx-0 flex-shrink-0">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={`${movie?.title} poster`}
                className="w-full h-auto rounded-lg shadow-xl shadow-amber-300/20"
              />
            ) : (
              <MoviePosterPlaceholder title={movie?.title ?? ""} />
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white" data-testid="detail-page-title">
              {movie?.title}
            </h1>
            {movie?.tagline && (
              <p className="text-lg text-gray-400 mt-2 italic" data-testid="detail-page-tagline">
                {movie?.tagline}
              </p>
            )}

            <div className="flex flex-wrap gap-4 mt-4">
              {movie?.vote_average > 0 && (
                <div className="flex items-center">
                  <StarIcon
                    size={18}
                    className="text-yellow-500 fill-yellow-500 mr-1"
                  />
                  <span className="text-white font-medium">
                    {movie?.vote_average.toFixed(1)}
                  </span>
                  <span className="text-gray-400 ml-1">
                    ({movie?.vote_count})
                  </span>
                </div>
              )}
              {movie?.runtime > 0 && (
                <div className="flex items-center text-gray-300">
                  <ClockIcon size={18} className="mr-1" />
                  <span>{formatRuntime(movie?.runtime)}</span>
                </div>
              )}
              {movie?.release_date && (
                <div className="flex items-center text-gray-300">
                  <CalendarIcon size={18} className="mr-1" />
                  <span>{new Date(movie?.release_date).getFullYear()}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {movie?.genres.map((genre) => (
                <div key={genre.id}>
                  {genre.name}
                </div>
              ))}
            </div>
            {/* Overview */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                Overview
              </h3>
              <p className="text-gray-300">
                {showFullOverview || movie?.overview.length <= 300
                  ? movie?.overview
                  : `${movie?.overview.substring(0, 300)}...`}
              </p>
              {movie?.overview.length > 300 && (
                <button
                  onClick={() => setShowFullOverview(!showFullOverview)}
                  className="text-purple-400 mt-2 text-sm hover:underline"
                >
                  {showFullOverview ? "Show Less" : "Read More"}
                </button>
              )}
            </div>
            {/* Director */}
            {director && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Director
                </h3>
                <div className="flex items-center">
                  {directorUrl ? (
                    <img
                      src={directorUrl}
                      alt={director.name}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                      <span className="text-gray-400 text-lg">
                        {director.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="text-white">{director.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Cast Section */}
        <div className="mt-12 mb-16">
          <h3 className="text-2xl font-semibold text-white mb-6">Top Cast</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {topCast.map((person) => {
              const castUrl = getProfileUrl(person.profile_path, "w185");
              return (
                <div
                  key={person.id}
                  className="bg-gray-900 rounded-lg overflow-hidden"
                >
                  {castUrl ? (
                    <img
                      src={castUrl}
                      alt={person.name}
                      className="w-full aspect-[2/3] object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-400 text-2xl">
                        {person.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="p-3">
                    <h4 className="font-medium text-white line-clamp-1">
                      {person.name}
                    </h4>
                    <p className="text-sm text-gray-400 line-clamp-1">
                      {person.character}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MovieDetail;
