// src/components/MovieCard/MovieCard.test.tsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // For extended matchers like toBeInTheDocument
import { BrowserRouter } from "react-router-dom"; // Needed for Link component
import MovieCard from "@/components/movie-card"; // Import the default export (which is memoized)
import { useTMDBConfig } from "@/hooks/use-tmdb-config"; // Import the hook
import type { MovieProps } from "@/types/tmdb"; // Use your specific Movie type

// --- Mocks ---

// Mock the useTMDBConfig hook
// This is crucial because MovieCard uses getPosterUrl from this hook.
// We want to control its output in tests.
jest.mock("@/hooks/use-tmdb-config", () => ({
  useTMDBConfig: jest.fn(() => ({
    getPosterUrl: jest.fn((path: string | null, size: string) =>
      path
        ? `https://image.tmdb.org/t/p/${size}${path}`
        : "placeholder-image-url.jpg"
    ),
  })),
}));

// Mock the MoviePosterPlaceholder component
// This prevents it from rendering its actual content and simplifies the MovieCard test.
jest.mock("./movie-poster-placeholder", () => ({
  MoviePosterPlaceholder: ({
    title,
    className,
  }: {
    title: string;
    className: string;
  }) => (
    <div data-testid="movie-poster-placeholder" className={className}>
      {`Mocked Placeholder for: ${title}`}
    </div>
  ),
}));

// --- Test Data ---

const mockMovie: MovieProps = {
  id: 123,
  title: "Epic Test Movie",
  poster_path: "/epic-test-poster.jpg",
  release_date: "2023-01-15",
  vote_average: 7.85, // Test with a decimal
  overview:
    "This is a captivating synopsis for an epic test movie. It has enough words to potentially line-clamp.",
  original_language: "en",
  // Add other required Movie properties if your Movie type is stricter
  adult: false,
  backdrop_path: null,
  genre_ids: [],
  original_title: "Epic Test Movie",
  popularity: 100.0,
  video: false,
  vote_count: 12345,
};

describe("MovieCard", () => {
  // Get a reference to the mocked getPosterUrl function for asserting calls
  const mockGetPosterUrl = jest.mocked(useTMDBConfig).mockReturnValue({
    getPosterUrl: jest.fn(), // Initialize with a mock function
  }).getPosterUrl;

  beforeEach(() => {
    // Clear all mock calls and reset mock implementations before each test
    jest.clearAllMocks();
    // Re-implement the default mock behavior for getPosterUrl for each test
    mockGetPosterUrl.mockImplementation((path: string | null, size: string) =>
      path
        ? `https://image.tmdb.org/t/p/${size}${path}`
        : "placeholder-image-url.jpg"
    );
  });

  // Test Case 1: Renders default variant correctly with all movie data
  test("renders movie details correctly for default variant with full data", () => {
    render(
      <BrowserRouter>
        <MovieCard variant="default" movie={mockMovie} />
      </BrowserRouter>
    );

    // Check if the movie title is displayed
    expect(
      screen.getByRole("heading", { name: "Epic Test Movie" })
    ).toBeInTheDocument();
    // Check if the release year is displayed
    expect(screen.getByText("2023")).toBeInTheDocument();
    // Check if the overview is displayed (and not the fallback)
    expect(screen.getByText(mockMovie.overview)).toBeInTheDocument();
    // Check if the rating is displayed and formatted correctly
    expect(screen.getByText("7.9")).toBeInTheDocument(); // 7.85 fixed to 1 decimal
    // Check if the original language is displayed and uppercased
    expect(screen.getByText("EN")).toBeInTheDocument();

    // Check if the Link has the correct href
    const linkElement = screen.getByRole("link", { name: /epic test movie/i });
    expect(linkElement).toHaveAttribute("href", "/movie/123");

    // Check if useTMDBConfig was called and getPosterUrl was used
    expect(useTMDBConfig).toHaveBeenCalledTimes(1);
    expect(mockGetPosterUrl).toHaveBeenCalledWith(
      "/epic-test-poster.jpg",
      "w342"
    );

    // Check if the main image is rendered with correct src and alt
    const imageElement = screen.getByAltText("Epic Test Movie poster");
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute(
      "src",
      "https://image.tmdb.org/t/p/w342/epic-test-poster.jpg"
    );
    expect(imageElement).toHaveAttribute("loading", "lazy");

    // Ensure placeholder is NOT rendered
    expect(
      screen.queryByTestId("movie-poster-placeholder")
    ).not.toBeInTheDocument();
  });

  // Test Case 2: Renders MoviePosterPlaceholder when poster_path is null
  test("renders MoviePosterPlaceholder when poster_path is null", () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null };
    render(
      <BrowserRouter>
        <MovieCard variant="default" movie={movieWithoutPoster} />
      </BrowserRouter>
    );

    // Verify useTMDBConfig was called with null path
    expect(mockGetPosterUrl).toHaveBeenCalledWith(null, "w342");

    // Check if the placeholder component is rendered instead of an <img>
    expect(screen.getByTestId("movie-poster-placeholder")).toBeInTheDocument();
    expect(
      screen.queryByAltText("Epic Test Movie poster")
    ).not.toBeInTheDocument(); // Ensure <img> is not there
    expect(
      screen.getByText("Mocked Placeholder for: Epic Test Movie")
    ).toBeInTheDocument(); // Check placeholder content
  });

  // Test Case 3: Renders placeholder variant correctly
  test("renders placeholder variant correctly", () => {
    render(<MovieCard variant="placeholder" />);

    // Check for elements specific to the placeholder variant
    const placeholderDiv = screen.getByTestId("movie-poster-placeholder");
    expect(placeholderDiv).toBeInTheDocument();
    expect(
      screen.getByText("Mocked Placeholder for: Movie")
    ).toBeInTheDocument(); // Placeholder's title is 'Movie'

    // Check for some of the animated placeholder divs (using a regex for part of the class name)
    expect(
      screen.getByText("", {
        selector: ".h-5.bg-gray-400\\/30.rounded.w-3\\/4",
      })
    ).toBeInTheDocument();

    // Ensure actual movie data elements are NOT rendered
    expect(
      screen.queryByRole("heading", { name: "Epic Test Movie" })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument(); // Placeholder shouldn't be a link
    expect(useTMDBConfig).not.toHaveBeenCalled(); // useTMDBConfig should not be called for placeholder variant
    expect(screen.queryByText("7.9")).not.toBeInTheDocument(); // Rating should not be present
  });

  // Test Case 4: Does not render vote average if movie.vote_average is 0
  test("does not render vote average if vote_average is 0", () => {
    const movieNoVote = { ...mockMovie, vote_average: 0 };
    render(
      <BrowserRouter>
        <MovieCard variant="default" movie={movieNoVote} />
      </BrowserRouter>
    );

    // Check that the rating text is not present
    expect(screen.queryByText("0.0")).not.toBeInTheDocument();
    // Check that the StarIcon is not present (assuming it's inside the conditional div)
    expect(screen.queryByTestId("star-icon")).not.toBeInTheDocument(); // Add data-testid="star-icon" to your StarIcon if you want to query it directly
  });

  // Test Case 5: Handles empty overview gracefully
  test('displays "No synopsis available" if overview is empty', () => {
    const movieNoOverview = { ...mockMovie, overview: "" };
    render(
      <BrowserRouter>
        <MovieCard variant="default" movie={movieNoOverview} />
      </BrowserRouter>
    );

    expect(screen.getByText("No synopsis available")).toBeInTheDocument();
    expect(screen.queryByText(mockMovie.overview)).not.toBeInTheDocument(); // Ensure original empty overview is not there
  });

  // Test Case 6: Handles undefined release_date
  test('displays "TBA" if release_date is undefined', () => {
    const movieNoReleaseDate = { ...mockMovie, release_date: undefined as any }; // Cast to any for testing undefined
    render(
      <BrowserRouter>
        <MovieCard variant="default" movie={movieNoReleaseDate} />
      </BrowserRouter>
    );

    expect(screen.getByText("TBA")).toBeInTheDocument();
  });
});
