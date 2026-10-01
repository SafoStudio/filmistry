export interface DiscoverQueryDto {
  page?: number;
  sortBy?: string;
  genres?: string;
  year?: number;
  ratingGte?: number;
  lang?: string;
}
