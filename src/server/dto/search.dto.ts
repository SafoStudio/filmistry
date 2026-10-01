export type SearchMediaType = 'movie' | 'tv' | 'person';

export interface SearchResultDto {
  id: number;
  mediaType: SearchMediaType;
  title: string;
  posterUrl: string | null;
  releaseYear: string;
}

export interface SearchResponseDto {
  page: number;
  totalPages: number;
  results: SearchResultDto[];
}
