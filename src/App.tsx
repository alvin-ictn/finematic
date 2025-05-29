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
    </QueryClientProvider>
  );
}
