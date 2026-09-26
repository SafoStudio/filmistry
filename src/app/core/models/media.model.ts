export interface Movie {
  id: number;
  title: string;
  posterUrl: string | null;
}

export interface MovieListResponse {
  page: number;
  totalPages: number;
  results: Movie[];
}
