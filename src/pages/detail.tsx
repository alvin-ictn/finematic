import { getMovieDetails } from "@/api/tmbd";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";


const MovieDetail = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const {
    data: movie,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(id as string),
    enabled: !!id,
  });

  console.log("data", movie);

  return <div>red</div>;
};

export default MovieDetail