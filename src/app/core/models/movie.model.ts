export interface Movie {
  id: number;
  title: string;
  posterUrl: string | null;
  releaseYear: string;
}

export interface MovieListResponse {
  page: number;
  totalPages: number;
  results: Movie[];
}
