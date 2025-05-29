import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MovieCard from "../movie-card";

const mockMovie = {
  id: 1,
  title: "Sample Movie",
  poster_path: "/sample-poster.jpg",
  release_date: "2023-01-01",
  original_language: "en",
  overview: "This is a sample movie overview.",
  vote_average: 8.5,
};

jest.mock("@/hooks/use-tmdb-config", () => ({
  useTMDBConfig: () => ({
    getPosterUrl: (path: string, size: string) => `https://image.tmdb.org/t/p/${size}${path}`,
  }),
}));

describe("MovieCard Component", () => {
  it("renders movie details correctly", () => {
    render(
      <MemoryRouter>
        <MovieCard variant="default" movie={mockMovie} />
      </MemoryRouter>
    );

    expect(screen.getByText("Sample Movie")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByText("This is a sample movie overview.")).toBeInTheDocument();
    expect(screen.getByText("8.5")).toBeInTheDocument();
    expect(screen.getByAltText("Sample Movie poster")).toBeInTheDocument();
  });

  it("renders placeholder variant correctly", () => {
    render(
      <MemoryRouter>
        <MovieCard variant="placeholder" />
      </MemoryRouter>
    );

    expect(screen.getByText("Movie")).toBeInTheDocument();
  });
});
