import { mockCredits, mockMovieDetails } from "@/__mocks__/movie-data";
import { getMovieCredits, getMovieDetails } from "@/api/tmbd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MovieDetail from "../detail";

jest.mock("@/api/tmbd", () => ({
  getMovieDetails: jest.fn(),
  getMovieCredits: jest.fn(),
}));

beforeEach(() => {
  queryClient.clear();

  (getMovieDetails as jest.Mock).mockResolvedValue(mockMovieDetails);
  (getMovieCredits as jest.Mock).mockResolvedValue(mockCredits);
});

jest.mock("@/hooks/use-tmdb-config", () => ({
  useTMDBConfig: () => ({
    getBackdropUrl: () => "mock-backdrop-url",
    getPosterUrl: () => "mock-poster-url",
    getProfileUrl: () => "mock-profile-url",
  }),
}));

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "123" }),
    useNavigate: () => jest.fn(),
  };
});

const mockShowBoundary = jest.fn();
jest.mock("react-error-boundary", () => ({
  useErrorBoundary: () => ({
    showBoundary: mockShowBoundary,
  }),
}));

const queryClient = new QueryClient();

const renderPage = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <MovieDetail />
      </MemoryRouter>
    </QueryClientProvider>
  );

describe("MovieDetail Page", () => {
  it("shows loading spinner", async () => {
    (getMovieDetails as jest.Mock).mockReturnValue(new Promise(() => {}));
    (getMovieCredits as jest.Mock).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders movie details correctly", async () => {
    renderPage();

    expect(await screen.findByTestId("detail-page")).toBeInTheDocument();

    const titleSection = await screen.findByTestId("detail-page-title");
    expect(within(titleSection).getByText(mockMovieDetails.title)).toBeInTheDocument();

    const taglineSection =  await screen.findByTestId("detail-page-tagline");
    expect(within(taglineSection).getByText(mockMovieDetails.tagline)).toBeInTheDocument();
  });
});
