export const category = {
  POPULAR: "popular",
  NOW_PLAYING: "now_playing",
  TOP_RATED: "top_rated",
  UPCOMING: "upcoming",
} as const;

export type CategoryProps = typeof category[keyof typeof category];

export const categoriesList: {
  id: CategoryProps;
  name: string;
}[] = [
  {
    id: category.POPULAR,
    name: "Popular",
  },
  {
    id: category.NOW_PLAYING,
    name: "Now Playing",
  },
  {
    id: category.TOP_RATED,
    name: "Top Rated",
  },
  {
    id: category.UPCOMING,
    name: "Coming Soon",
  },
];

export const categoriesEndpoint: Record<string, string> = {
  [category.NOW_PLAYING]: "/movie/now_playing",
  [category.POPULAR]: "/movie/popular",
  [category.TOP_RATED]: "/movie/top_rated",
  [category.UPCOMING]: "/movie/upcoming",
};
