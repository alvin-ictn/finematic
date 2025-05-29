import { getConfiguration } from "@/api/tmbd";
import {
  type BackdropSizeProps,
  type ConfigResponseProps,
  type PosterSizeProps,
  type ProfileSizeProps,
} from "@/types/tmdb";
import { useQuery } from "@tanstack/react-query";

export const useTMDBConfig = () => {
  const {
    data: config,
    isLoading: isLoadingConfig,
    isError: isErrorConfig,
    error: errorConfig,
  } = useQuery<ConfigResponseProps>({
    queryKey: ["config"],
    queryFn: getConfiguration,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 3,
  });

  const getPosterUrl = (
    posterPath: string | null,
    size: PosterSizeProps = "w500"
  ): string | null => {
    if (!config || !posterPath) {
      return null;
    }
    return `${config.images.secure_base_url}${size}${posterPath}`;
  };

  const getBackdropUrl = (
    backdropPath: string | null,
    size: BackdropSizeProps = "original"
  ): string | null => {
    if (!config || !backdropPath) {
      return null;
    }
    return `${config.images.secure_base_url}${size}${backdropPath}`;
  };

  const getProfileUrl = (
    profilePath: string | null,
    size: ProfileSizeProps = "original"
  ): string | null => {
    if (!config || !profilePath) {
      return null;
    }
    return `${config.images.secure_base_url}${size}${profilePath}`;
  };

  return {
    config,
    isLoading: isLoadingConfig,
    isError: isErrorConfig,
    error: errorConfig,
    getPosterUrl,
    getBackdropUrl,
    getProfileUrl
  };
};
