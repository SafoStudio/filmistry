export interface MovieListItemDto {
  id: number;
  title: string;
  posterUrl: string | null;
  releaseYear: string;
}

export interface MovieListDto {
  page: number;
  totalPages: number;
  results: MovieListItemDto[];
}
