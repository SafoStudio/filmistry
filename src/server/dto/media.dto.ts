export interface MediaListItemDto {
  id: number;
  title: string;
  posterUrl: string | null;
}

export interface MediaListDto {
  page: number;
  totalPages: number;
  results: MediaListItemDto[];
}
