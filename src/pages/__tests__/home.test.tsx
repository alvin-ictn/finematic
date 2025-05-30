import { mockConfigResponse } from "@/__mocks__/movie-config";
import {
  mockCredits,
  mockMovie,
  mockMovieDetails,
  searchMockMovie,
} from "@/__mocks__/movie-data";
import {
  getConfiguration,
  getMovieCredits,
  getMovieDetails,
  getMoviesByCategory,
  searchMovies,
} from "@/api/tmbd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  createMemoryRouter,
  MemoryRouter,
  RouterProvider,
} from "react-router-dom";
import userEvent from "@testing-library/user-event";
import MovieDetail from "../detail";
import Home from "../home";

const renderWithMemoryRouter = (initialEntries = ["/"]) => {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/movie/:id",
        element: <MovieDetail />,
      },
    ],
    { initialEntries }
  );

  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

jest.mock("@/api/tmbd", () => ({
  getConfiguration: jest.fn(),
  getMoviesByCategory: jest.fn(),
  searchMovies: jest.fn(),
  getMovieDetails: jest.fn(),
  getMovieCredits: jest.fn(),
}));

beforeEach(() => {
  (getMoviesByCategory as jest.Mock).mockResolvedValue({
    page: 1,
    total_pages: 1,
    results: [mockMovie],
    total_results: 1,
  });

  (searchMovies as jest.Mock).mockResolvedValue({
    page: 1,
    total_pages: 1,
    results: [searchMockMovie],
    total_results: 1,
  });

  (getConfiguration as jest.Mock).mockResolvedValue({
    images: {
      secure_base_url: mockConfigResponse.images.base_url,
      poster_sizes: mockConfigResponse.images.poster_sizes,
    },
  });

  (getMovieDetails as jest.Mock).mockResolvedValue(mockMovieDetails);
  (getMovieCredits as jest.Mock).mockResolvedValue(mockCredits);
});

jest.mock("react-error-boundary", () => ({
  __esModule: true,
  useErrorBoundary: () => ({
    showBoundary: jest.fn(),
  }),
}));

jest.mock("@/hooks/use-infinity-scroll", () => ({
  useInfiniteScroll: () => ({
    lastElementRef: { current: null },
  }),
}));

const renderWithQuery = (children: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );
};

describe("Home Pages", () => {
  describe("test search movie", () => {
    it("renders movies and responds to search", async () => {
      renderWithQuery(<Home />);

      // Wait for initial movies
      expect(await screen.findAllByText("Lilo & Stitch")).not.toHaveLength(0);

      // Type in the search input
      fireEvent.change(screen.getByTestId("search-movie"), {
        target: { value: "Final Destination Bloodlines" },
      });

      const results = await screen.findAllByText(
        "Final Destination Bloodlines"
      );
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe("user visit detail page from home by clicking a movie card", () => {
    it("navigates to detail page on movie click", async () => {
      renderWithMemoryRouter(["/"]);

      const movieCardLink = await screen.findByTestId("movie-card-link-552524");
      expect(movieCardLink).toHaveAttribute("href", "/movie/552524");

      await userEvent.click(movieCardLink);

      const detailPage = await screen.findByTestId("detail-page");
      expect(detailPage).toBeInTheDocument();

    });
  });
});
