export interface TvEpisode {
  id: number;
  episodeNumber: number;
  name: string;
  overview: string;
  stillUrl: string | null;
  airDate: string | null;
  runtime: number;
  voteAverage: number;
}

export interface TvSeasonDetail {
  id: number;
  seasonNumber: number;
  name: string;
  overview: string;
  posterUrl: string | null;
  airDate: string | null;
  episodeCount: number;
  episodes: TvEpisode[];
}

export interface TvSeasonListItem {
  id: number;
  seasonNumber: number;
  name: string;
  posterUrl: string | null;
  airDate: string | null;
  episodeCount: number;
}
