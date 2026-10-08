import { TMDB_IMAGE_BASE_URL, POSTER_SIZE, GALLERY_SIZE } from '../constants';
import { TvSeasonDetailDto, TvEpisodeDto, TvSeasonListItemDto } from '../dto/tv-season.dto';

interface TmdbEpisodeRaw {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string | null;
  runtime: number;
  vote_average: number;
}

export interface TmdbSeasonDetailRaw {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string | null;
  episodes: TmdbEpisodeRaw[];
}

function buildUrl(path: string | null, size: string): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

function toEpisodeDto(raw: TmdbEpisodeRaw): TvEpisodeDto {
  return {
    id: raw.id,
    episodeNumber: raw.episode_number,
    name: raw.name ?? '',
    overview: raw.overview ?? '',
    stillUrl: buildUrl(raw.still_path, GALLERY_SIZE),
    airDate: raw.air_date ?? null,
    runtime: raw.runtime ?? 0,
    voteAverage: raw.vote_average ?? 0,
  };
}

export function toTvSeasonDetailDto(raw: TmdbSeasonDetailRaw): TvSeasonDetailDto {
  return {
    id: raw.id,
    seasonNumber: raw.season_number,
    name: raw.name,
    overview: raw.overview ?? '',
    posterUrl: buildUrl(raw.poster_path, POSTER_SIZE),
    airDate: raw.air_date ?? null,
    episodeCount: raw.episodes?.length ?? 0,
    episodes: (raw.episodes ?? []).map(toEpisodeDto),
  };
}

export function toTvSeasonListItemDto(raw: TmdbSeasonDetailRaw): TvSeasonListItemDto {
  return {
    id: raw.id,
    seasonNumber: raw.season_number,
    name: raw.name,
    posterUrl: buildUrl(raw.poster_path, POSTER_SIZE),
    airDate: raw.air_date ?? null,
    episodeCount: raw.episodes?.length ?? 0,
  };
}
