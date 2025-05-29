export type BackdropSizeProps = "w300" | "w780" | "w1280" | "original";
export type LogoSizeProps =
  | "w45"
  | "w92"
  | "w154"
  | "w185"
  | "w300"
  | "w500"
  | "original";
export type PosterSizeProps =
  | "w92"
  | "w154"
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "original";
export type ProfileSizeProps = "w45" | "w185" | "h632" | "original";
export type StillSizeProps = "w92" | "w185" | "w300" | "original";

export interface ConfigResponseProps {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: BackdropSizeProps[];
    logo_sizes: LogoSizeProps[];
    poster_sizes: PosterSizeProps[];
    profile_sizes: ProfileSizeProps[];
    still_sizes: StillSizeProps[];
  };
  change_keys: string[];
}

export interface MovieProps {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface CollectionsProps {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

interface ProductionCompanyProps {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface ProductionCountriesProps {
  iso_3166_1: string;
  name: string;
}

interface SpokenLanguagesProps {
  english_name: string;
  iso_639_1: string;
  name: string;
}
export interface MovieDetailsProps extends MovieProps {
  runtime: number;
  belongs_to_collection: CollectionsProps | null;
  homepage: string | null;
  imdb_id: string | null;
  origin_country: string[];
  production_companies: ProductionCompanyProps[];
  production_countries: ProductionCountriesProps[];
  spoken_languages: SpokenLanguagesProps[];
  genres: { id: number; name: string }[];
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  vote_count: number;
}

export interface MovieListResponseProps<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface MovieListInfinityProps<T> {
  page: number[];
  pages: T[];
}

export interface CastProps {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}
export interface CrewProps {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}
export interface CreditsProps {
  cast: CastProps[];
  crew: CrewProps[];
}
