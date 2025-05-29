import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import ErrorFallback from "./components/error-fallback";
import { router } from "./router";

const queryClient = new QueryClient();

export default function App() {
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
