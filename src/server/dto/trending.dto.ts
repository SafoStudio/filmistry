export interface TrendingItemDto {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  backdropUrl: string | null;
  posterUrl: string | null;
}

export interface TrendingDto {
  results: TrendingItemDto[];
}
