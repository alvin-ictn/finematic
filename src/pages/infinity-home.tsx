import { getMoviesByCategory, searchMovies } from "@/api/tmbd";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";

export default function InfinityHome() {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [page, setPage] = useState(0);
  const [currentCategory, setCurrentCategory] = useState<
    "popular" | "now_playing" | "top_rated" | "upcoming"
  >("popular");

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["movies", currentCategory, searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      // pageParam will be `undefined` for the first call, then 2, 3, etc.
      if (searchQuery) {
        return searchMovies(searchQuery, pageParam as number);
      }
      return getMoviesByCategory(currentCategory, pageParam as number);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      const currentPage =
        lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
      //   setPage(() => currentPage);
      return currentPage;
    },
  });

  console.log("DATA------", data);

  const movieData = useMemo(() => {
    return (
      data?.pages.flatMap((page) =>
        page.results.map((res) => ({ ...res, fromPage: page.page }))
      ) || []
    );
  }, [data]);
  console.log("data", movieData, isFetchingNextPage, hasNextPage);

  return status === "pending" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {movieData.map((movie) => (
        <div key={`${movie.id}-${movie.fromPage}`}>
          {movie.fromPage} {movie.id} - {movie.title}
        </div>
      ))}
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetching}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </>
  );
}
