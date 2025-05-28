import type { Category } from "@/types";

export const categoriesList: {
  id: Category;
  name: string;
}[] = [
  {
    id: "popular",
    name: "Popular",
  },
  {
    id: "now_playing",
    name: "Now Playing",
  },
  {
    id: "top_rated",
    name: "Top Rated",
  },
  {
    id: "upcoming",
    name: "Coming Soon",
  },
];

export const categoriesEndpoint: Record<string, string> = {
  now_playing: "/movie/now_playing",
  popular: "/movie/popular",
  top_rated: "/movie/top_rated",
  upcoming: "/movie/upcoming",
};
