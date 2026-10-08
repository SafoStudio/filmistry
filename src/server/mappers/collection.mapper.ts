import { TMDB_IMAGE_BASE_URL, POSTER_SIZE, POSTER_SIZE_DETAIL, BACKDROP_SIZE } from '../constants';
import { CollectionDto } from '../dto/collection.dto';
import { MediaListItemDto } from '../dto/media.dto';

interface TmdbCollectionPartRaw {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
}

export interface TmdbCollectionRaw {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: TmdbCollectionPartRaw[];
}

function buildUrl(path: string | null, size: string): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

function toMediaListItemDto(raw: TmdbCollectionPartRaw): MediaListItemDto {
  return {
    id: raw.id,
    title: raw.title,
    posterUrl: buildUrl(raw.poster_path, POSTER_SIZE),
  };
}

export function toCollectionDto(raw: TmdbCollectionRaw): CollectionDto {
  return {
    id: raw.id,
    name: raw.name,
    overview: raw.overview ?? '',
    posterUrl: buildUrl(raw.poster_path, POSTER_SIZE_DETAIL),
    backdropUrl: buildUrl(raw.backdrop_path, BACKDROP_SIZE),
    parts: (raw.parts ?? []).map(toMediaListItemDto),
  };
}
