import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import ErrorFallback from "./components/error-fallback";
import { useTMDBConfig } from "./hooks/use-tmdb-config";
import { router } from "./router";

const queryClient = new QueryClient();

export default function App() {
  const { isLoading, isError, error } = useTMDBConfig();

  if (isLoading) {
    return <div className="text-center p-8">Loading app configuration...</div>;
  }

  if (isError) {
    return (
      <div className="text-center p-8 text-red-500">
        Error loading app configuration: {error?.message}
        <p>Please check your internet connection or API key.</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <RouterProvider router={router} />
      </ErrorBoundary>
      {/* <BrowserRouter>
        <Routes>
          <Route>
            <Route index element={<Home />} />
            <Route
              path="/movie/:id"
              element={
                <ErrorBoundary FallbackComponent={ErrorDetailPage}>
                  <MovieDetail />
                </ErrorBoundary>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter> */}
    </QueryClientProvider>
  );
}
