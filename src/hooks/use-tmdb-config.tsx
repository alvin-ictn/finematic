import { getConfiguration } from "@/api/tmbd";
import { type ConfigResponseProps, type PosterSizeProps } from "@/types/tmdb";
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

  return {
    config,
    isLoading: isLoadingConfig,
    isError: isErrorConfig,
    error: errorConfig,
    getPosterUrl,
  };
};
