export interface Media {
  id: number;
  title: string;
  posterUrl: string | null;
}

export interface MediaListResponse {
  page: number;
  totalPages: number;
  results: Media[];
}
