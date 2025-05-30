import { mockMovie } from "@/__mocks__/movie-data";
import { MovieHero } from "@/components/movie-hero";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => ({
      pathname: "/some/invalid/path",
    }),
    useNavigate: jest.fn(),
  };
});

jest.mock("@/hooks/use-tmdb-config", () => ({
  useTMDBConfig: () => ({
    getBackdropUrl: (path: string, size: string) =>
      `https://mockimage.tmdb.org/${size}${path}`,
  }),
}));

describe("MovieHero", () => {
  it("renders movie title, overview, rating, and year", () => {
    render(<MovieHero movie={mockMovie} />, { wrapper: MemoryRouter });

    expect(screen.getByTestId("movie-hero-title")).toHaveTextContent(
      mockMovie.title
    );
    expect(screen.getByTestId("movie-hero-overview")).toHaveTextContent(
      mockMovie.overview
    );
  });

  it("navigates on button click", () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(<MovieHero movie={mockMovie} />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByTestId("more-info-button"));
    expect(mockNavigate).toHaveBeenCalledWith(`/movie/${mockMovie.id}`);
  });
});
