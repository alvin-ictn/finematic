import { mockMovie } from "@/__mocks__/movie-data";
import MovieList from "@/components/movie-list";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const customMockMovie = {
  ...mockMovie,
  fromPage: 1,
};

const renderWithQuery = (children: React.ReactElement) => {
  const queryClient = new QueryClient();

  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );
};
describe("MovieList", () => {
  it("renders actual movie cards", () => {
    renderWithQuery(
      <MovieList
        movies={[customMockMovie]}
        isLoading={true}
        hasMore={true}
        loadingRef={() => {}}
      />
    );

    expect(screen.getByTestId("movie-card-link-552524")).toBeInTheDocument();
  });
});
