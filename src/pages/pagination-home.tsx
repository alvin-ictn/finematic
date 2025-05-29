import { getMoviesByCategory, searchMovies } from "@/api/tmbd";
import MovieCard from "@/components/movie-card";
import MovieList from "@/components/movie-list";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useInfiniteScroll } from "@/hooks/use-infinity-scroll";
import type { Category } from "@/types/constant";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Fragment, useEffect, useMemo, useState } from "react";
import React from "react";

const generatePaginationLinks = (
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
) => {
  const pages: JSX.Element[] = [];
  const maxVisiblePages = 5; // How many page numbers to show at once (e.g., 1 2 3 ... 9 10)

  if (totalPages <= maxVisiblePages) {
    // Show all pages if total pages are few
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
  } else {
    // Logic for showing ellipses
    // Always show first page
    pages.push(
      <PaginationItem key={1}>
        <PaginationLink
          onClick={() => onPageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if current page is far from beginning
    if (currentPage > 3) {
      pages.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show pages around the current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if current page is far from end
    if (currentPage < totalPages - 2) {
      pages.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page
    pages.push(
      <PaginationItem key={totalPages}>
        <PaginationLink
          onClick={() => onPageChange(totalPages)}
          isActive={currentPage === totalPages}
        >
          {totalPages}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return pages;
};

const PaginationHome = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentCategory, setCurrentCategory] = useState<
    "popular" | "now_playing" | "top_rated" | "upcoming"
  >("popular");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // useQuery will refetch whenever 'currentPage', 'currentCategory', or 'searchQuery' changes
  const {
    data, // Data for the current page
    isLoading, // True during initial load and subsequent page fetches
    isFetching, // True only during fetch (can be used to show loading on page change)
    isError,
    error,
    isPreviousData, // Useful for showing stale data while new data loads
  } = useQuery<TmdbListResponse<Movie>, Error>({
    queryKey: ["movies", currentCategory, searchQuery, currentPage], // Unique key for each page/category/search
    queryFn: async () => {
      if (searchQuery) {
        return searchMovies(searchQuery, currentPage);
      }
      return getMoviesByCategory(currentCategory, currentPage);
    },
    keepPreviousData: true, // Keep old data visible while fetching new page
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Data kept in cache for 10 minutes
    retry: 3,
  });

  // Effect to reset page to 1 when category or search query changes
  useEffect(() => {
    setCurrentPage(1); // Always reset to page 1 for new category/search
  }, [currentCategory, searchQuery]);

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on page change
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const isInitialLoading = isLoading && !isPreviousData; // True only for the very first load
  const isTransitioningPage = isLoading && isPreviousData; // True when fetching next page, but old data is still shown
  const noResults =
    !isLoading && movies.length === 0 && (searchQuery || currentCategory);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">TMDB Movies</h1>

      {isInitialLoading ? (
        <div />
      ) : noResults ? (
        <div className="text-center text-gray-500 mt-8">
          No movies found for your search/category.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} /> // Using movie.id as key
            ))}
          </div>
          <div className="flex justify-center items-center mt-8 space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1 || isTransitioningPage}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
            <span className="text-lg font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages || isTransitioningPage}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
          {/* Show small spinner during page transition */}
        </>
      )}
      <div className="flex justify-center mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || isTransitioningPage}
              />
            </PaginationItem>

            {/* Render dynamic page numbers using the helper */}
            {generatePaginationLinks(currentPage, totalPages, handlePageChange)}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isTransitioningPage}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
export default PaginationHome;
