import { TMDB_IMAGE_BASE_URL, POSTER_SIZE_DETAIL, BACKDROP_SIZE } from '../constants';
import { MovieDetailDto } from '../dto/movie-detail.dto';

interface TmdbVideoRaw {
  key: string;
  site: string;
  type: string;
}

interface TmdbGenreRaw {
  id: number;
  name: string;
}

export interface TmdbMovieDetailRaw {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: TmdbGenreRaw[];
  videos?: {
    results: TmdbVideoRaw[];
  };
}

function buildUrl(path: string | null, size: string): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

function findTrailerKey(videos: TmdbVideoRaw[] | undefined): string | null {
  if (!videos) return null;
  const trailer = videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
  return trailer?.key ?? null;
}

export function toMovieDetailDto(raw: TmdbMovieDetailRaw): MovieDetailDto {
  return {
    id: raw.id,
    title: raw.title,
    overview: raw.overview,
    posterUrl: buildUrl(raw.poster_path, POSTER_SIZE_DETAIL),
    backdropUrl: buildUrl(raw.backdrop_path, BACKDROP_SIZE),
    releaseYear: raw.release_date?.slice(0, 4) ?? '',
    runtime: raw.runtime ?? 0,
    voteAverage: raw.vote_average ?? 0,
    genres: raw.genres?.map((g) => g.name) ?? [],
    trailerKey: findTrailerKey(raw.videos?.results),
  };
}
