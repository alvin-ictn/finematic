import { createBrowserRouter, type RouteObject } from "react-router-dom";
import MovieListPage from "./pages/home";
import MovieDetailPage from "./pages/detail";
import NotFoundPage from "./pages/404";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MovieListPage />,
  },
  {
    path: "/movie/:id",
    element: <MovieDetailPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes);
