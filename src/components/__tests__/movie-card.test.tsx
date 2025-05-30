import { mockConfigResponse } from "@/__mocks__/movie-config";
import { mockMovie } from "@/__mocks__/movie-data";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MovieCard from "../movie-card";

const { images: imgConfig } = mockConfigResponse;

jest.mock("@/hooks/use-tmdb-config", () => ({
  useTMDBConfig: () => ({
    getPosterUrl: (path: string | null, size: string) => {
      if (!path) return null;
      return `https://image.tmdb.org/t/p/${size}${path}`;
    },
  }),
}));

describe("movie-card component", () => {
  describe("movie-card placeholder variant", () => {
    it("should renders movie-card-skeleton", () => {
      render(<MovieCard variant="placeholder" />, { wrapper: MemoryRouter });

      expect(screen.getByTestId("movie-card-skeleton")).toBeInTheDocument();
    });
  });

  it("should renders the movie card with correct info", () => {
    render(<MovieCard variant="default" movie={mockMovie} />, {
      wrapper: MemoryRouter,
    });
    expect(screen.getByText("Lilo & Stitch")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByText(/lonely Hawaiian girl/i)).toBeInTheDocument();
    expect(screen.getByText("7.1")).toBeInTheDocument();
  });

  it("should show links to the correct movie detail page", () => {
    render(<MovieCard movie={mockMovie} />, {
      wrapper: MemoryRouter,
    });

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/movie/552524");
  });

  it("should show correct the image url path", () => {
    render(<MovieCard movie={mockMovie} />, {
      wrapper: MemoryRouter,
    });

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute(
      "src",
      `${imgConfig.base_url}w342/mKKqV23MQ0uakJS8OCE2TfV5jNS.jpg`
    );
  });

  it("should render the image placeholder if src is null", () => {
    const mockMovieWithoutPoster = {
      ...mockMovie,
      poster_path: null,
    };
    render(<MovieCard movie={mockMovieWithoutPoster} />, {
      wrapper: MemoryRouter,
    });

    expect(screen.getByTestId("poster-placeholder")).toBeInTheDocument();
  });
});
