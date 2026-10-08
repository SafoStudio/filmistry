import { TMDB_IMAGE_BASE_URL, POSTER_SIZE_DETAIL, BACKDROP_SIZE, POSTER_SIZE } from '../constants';
import { MediaDetailDto } from '../dto/media-detail.dto';
import { MediaListItemDto } from '../dto/media.dto';

interface TmdbVideoRaw {
  key: string;
  site: string;
  type: string;
}

interface TmdbGenreRaw {
  id: number;
  name: string;
}

interface TmdbRecommendationRaw {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
}

export interface TmdbMediaDetailRaw {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  episode_run_time?: number[];
  vote_average: number;
  genres?: TmdbGenreRaw[];
  videos?: {
    results: TmdbVideoRaw[];
  };
  recommendations?: {
    results: TmdbRecommendationRaw[];
  };
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string | null;
  } | null;
  seasons?: Array<{
    id: number;
    season_number: number;
    name: string;
    poster_path: string | null;
    air_date: string | null;
    episode_count: number;
  }>;
}

const MAX_RECOMMENDATIONS = 12;

function buildUrl(path: string | null, size: string): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

function findTrailerKey(videos: TmdbVideoRaw[] | undefined): string | null {
  if (!videos) return null;
  const trailer = videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
  return trailer?.key ?? null;
}

function toRecommendationDto(raw: TmdbRecommendationRaw): MediaListItemDto {
  return {
    id: raw.id,
    title: raw.title ?? raw.name ?? '',
    posterUrl: buildUrl(raw.poster_path, POSTER_SIZE),
  };
}

export function toMediaDetailDto(raw: TmdbMediaDetailRaw): MediaDetailDto {
  const releaseDate = raw.release_date ?? raw.first_air_date ?? '';
  const runtime = raw.runtime ?? raw.episode_run_time?.[0] ?? 0;

  return {
    id: raw.id,
    title: raw.title ?? raw.name ?? '',
    overview: raw.overview,
    posterUrl: buildUrl(raw.poster_path, POSTER_SIZE_DETAIL),
    backdropUrl: buildUrl(raw.backdrop_path, BACKDROP_SIZE),
    releaseYear: releaseDate.slice(0, 4),
    runtime,
    voteAverage: raw.vote_average ?? 0,
    genres: raw.genres?.map((g) => g.name) ?? [],
    trailerKey: findTrailerKey(raw.videos?.results),
    recommendations:
      raw.recommendations?.results
        .filter((r) => r.poster_path)
        .slice(0, MAX_RECOMMENDATIONS)
        .map(toRecommendationDto) ?? [],
    belongsToCollection: raw.belongs_to_collection
      ? {
          id: raw.belongs_to_collection.id,
          name: raw.belongs_to_collection.name,
          posterUrl: buildUrl(raw.belongs_to_collection.poster_path, POSTER_SIZE),
        }
      : null,
    seasons:
      raw.seasons?.map((s) => ({
        id: s.id,
        seasonNumber: s.season_number,
        name: s.name,
        posterUrl: buildUrl(s.poster_path, POSTER_SIZE),
        airDate: s.air_date ?? null,
        episodeCount: s.episode_count ?? 0,
      })) ?? [],
  };
}
