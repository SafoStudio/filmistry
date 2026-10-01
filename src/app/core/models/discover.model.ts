export type DiscoverSortBy =
  | 'popularity.desc'
  | 'popularity.asc'
  | 'vote_average.desc'
  | 'vote_average.asc'
  | 'primary_release_date.desc'
  | 'primary_release_date.asc'
  | 'first_air_date.desc'
  | 'first_air_date.asc'
  | 'title.asc'
  | 'title.desc'
  | 'name.asc'
  | 'name.desc';

export interface DiscoverParams {
  page?: number;
  sort?: DiscoverSortBy;
  genres?: string;
  year?: number;
  rating?: number;
}
