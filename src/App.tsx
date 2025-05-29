import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MovieDetail from "./pages/detail";
import Home from "./pages/home";
import { ErrorBoundary } from "react-error-boundary";
import ErrorDetailPage from "./components/error-detail-page";
import NotFound from "./pages/404";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
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
      </BrowserRouter>
    </QueryClientProvider>
  );
}
