import { TMDB_IMAGE_BASE_URL, POSTER_SIZE } from '../constants';
import { MediaListDto, MediaListItemDto } from '../dto/media.dto';

export interface TmdbMediaListRaw {
  page: number;
  total_pages: number;
  results: TmdbMediaRaw[];
}

export interface TmdbMediaRaw {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
}

function buildPosterUrl(posterPath: string | null): string | null {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE_URL}/${POSTER_SIZE}${posterPath}`;
}

function toMediaListItemDto(raw: TmdbMediaRaw): MediaListItemDto {
  return {
    id: raw.id,
    title: raw.title ?? raw.name ?? '',
    posterUrl: buildPosterUrl(raw.poster_path),
  };
}

export function toMediaListDto(raw: TmdbMediaListRaw): MediaListDto {
  return {
    page: raw.page,
    totalPages: Math.min(raw.total_pages, 500),
    results: raw.results.map(toMediaListItemDto),
  };
}
