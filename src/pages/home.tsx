import { getMoviesByCategory, searchMovies } from "@/api/tmbd";
import BackToTopButton from "@/components/back-to-top";
import { CategoryTabs } from "@/components/category-tabs";
import { MovieHero } from "@/components/movie-hero";
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
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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
    isFetched: isMovieFetched,
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

  const { data: featuredMoviesData, isFetched } = useQuery({
    queryKey: ["featured-movies"],
    queryFn: () => getMoviesByCategory("popular", 1),
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

  if (isError) {
    return (
      <div className="text-red-600 text-center py-4">
        Error: {error?.message ?? "Failed to load movies."}
      </div>
    );
  }

  return (
    <div className="">
      {featuredMoviesData && isFetched && (
        <MovieHero movie={featuredMoviesData?.results[0]} />
      )}
      <main className="container mx-auto px-4 py-8">
        <div>
          <SearchBar
            searchQuery={(e) => setSearchQuery(() => e.target.value)}
          />
        </div>
        {!searchQuery ? (
          <CategoryTabs
            activeCategory={category}
            onCategoryChange={(category) =>
              setCategory(category as CategoryProps)
            }
            list={categoriesList}
          />
        ) : (
          isMovieFetched &&
          data &&
          data.pages[0].total_results > 0 && (
            <h2 className="text-2xl">
              Found {data.pages[0].total_results} movies matching your search.
            </h2>
          )
        )}
        <MovieList
          movies={allMovies}
          isLoading={isLoading || isFetching}
          hasMore={hasNextPage}
          loadingRef={lastElementRef}
        />
      </main>
      <BackToTopButton />
    </div>
  );
};
export default Home;
