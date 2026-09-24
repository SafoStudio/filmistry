export interface TrendingItem {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  backdropUrl: string | null;
  posterUrl: string | null;
}

export interface Trending {
  results: TrendingItem[];
}
