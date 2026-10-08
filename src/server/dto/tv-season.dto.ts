export interface TvEpisodeDto {
  id: number;
  episodeNumber: number;
  name: string;
  overview: string;
  stillUrl: string | null;
  airDate: string | null;
  runtime: number;
  voteAverage: number;
}

export interface TvSeasonDetailDto {
  id: number;
  seasonNumber: number;
  name: string;
  overview: string;
  posterUrl: string | null;
  airDate: string | null;
  episodeCount: number;
  episodes: TvEpisodeDto[];
}

export interface TvSeasonListItemDto {
  id: number;
  seasonNumber: number;
  name: string;
  posterUrl: string | null;
  airDate: string | null;
  episodeCount: number;
}
