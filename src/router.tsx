import { createBrowserRouter, type RouteObject } from "react-router-dom";
import MovieListPage from "./pages/home";
import MovieDetailPage from "./pages/detail";
import NotFoundPage from "./pages/404";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/error-fallback";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MovieListPage />,
  },
  {
    path: "/movie/:id",
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <MovieDetailPage />
      </ErrorBoundary>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes);
