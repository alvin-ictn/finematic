import { getMoviesByCategory } from "@/api/tmbd";
import MovieList from "@/components/movie-list";
import { useInfiniteScroll } from "@/hooks/use-infinity-scroll";
import type { Category } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const Home = () => {
  const [category, setCategory] = useState<Category>("popular");
  const [movies, setMovies] = useState([]);
  const { page, hasMore, setHasMore, lastElementRef, resetPage } =
    useInfiniteScroll();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["movies", category, page],
    queryFn: () => {
      return getMoviesByCategory(category, page);
    },
  });

  useEffect(() => {
    resetPage();
    setMovies([]);
  }, [category, resetPage]);

  useEffect(() => {
    if (data) {
      if (page === 1) {
        setMovies(data.results);
      } else {
        setMovies((prev) => [...prev, ...data.results]);
      }
      setHasMore(data.page < data.total_pages);
    }
  }, [data, page, setHasMore]);

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
  };
  return (
    <main className="">
      <MovieList
        movies={movies}
        isLoading={isLoading || isFetching}
        hasMore={hasMore}
        loadingRef={lastElementRef}
      />
    </main>
  );
};
export default Home;
