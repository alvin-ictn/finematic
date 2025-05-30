import { getMoviesByCategory, searchMovies } from "@/api/tmbd";
import BackToTopButton from "@/components/back-to-top";
import { CategoryTabs } from "@/components/category-tabs";
import MovieList from "@/components/movie-list";
import SearchBar from "@/components/search-bar";
import { categoriesList, type CategoryProps } from "@/constants/category";
import { useDebounce } from "@/hooks/use-debounce";
import { useInfiniteScroll } from "@/hooks/use-infinity-scroll";
import type {
  MovieListInfinityProps,
  MovieListResponseProps,
  MovieProps,
} from "@/types/tmdb";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";

const Home = () => {
  const [category, setCategory] = useState<CategoryProps>("popular");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 400);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery<
    MovieListResponseProps<MovieProps>,
    Error,
    MovieListInfinityProps<MovieListResponseProps<MovieProps>>,
    string[],
    number
  >({
    queryKey: ["movies", category, debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      if (debouncedSearch) {
        return searchMovies(debouncedSearch, pageParam as number);
      }
      return getMoviesByCategory(category, pageParam as number);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 3,
    enabled: !!category,
  });

  const allMovies: (MovieProps & { fromPage: number })[] = useMemo(() => {
    return (
      data?.pages.flatMap((page) =>
        page.results.map((res) => ({ ...res, fromPage: page.page }))
      ) || []
    );
  }, [data]);

  const { lastElementRef } = useInfiniteScroll({
    onIntersect: fetchNextPage,
    hasMore: hasNextPage ?? false,
    loading: isFetchingNextPage,
  });

  useEffect(() => {
    refetch();
  }, [category, debouncedSearch, refetch]);

  return (
    <main className="container mx-auto px-4 py-8">
      {isError && (
        <div className="text-red-600 text-center py-4">
          Error: {error?.message ?? "Failed to load movies."}
        </div>
      )}
      <div>
        <SearchBar searchQuery={(e) => setSearchQuery(() => e.target.value)} />
      </div>
      <CategoryTabs
        activeCategory={category}
        onCategoryChange={(category) => setCategory(category as CategoryProps)}
        list={categoriesList}
      />
      <MovieList
        movies={allMovies}
        isLoading={isLoading || isFetching}
        hasMore={hasNextPage}
        loadingRef={lastElementRef}
      />
      <BackToTopButton />
    </main>
  );
};
export default Home;
