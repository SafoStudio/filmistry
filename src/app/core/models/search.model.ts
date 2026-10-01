export type SearchMediaType = 'movie' | 'tv' | 'person';

export interface SearchResult {
  id: number;
  mediaType: SearchMediaType;
  title: string;
  posterUrl: string | null;
  releaseYear: string;
}

export interface SearchResponse {
  page: number;
  totalPages: number;
  results: SearchResult[];
}
