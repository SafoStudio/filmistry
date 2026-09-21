export interface MovieListItemDto {
  id: number;
  title: string;
  posterUrl: string | null;
}

export interface MovieListDto {
  page: number;
  totalPages: number;
  results: MovieListItemDto[];
}
