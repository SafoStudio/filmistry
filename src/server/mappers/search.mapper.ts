import { TMDB_IMAGE_BASE_URL, POSTER_SIZE, PROFILE_SIZE } from '../constants';
import { SearchResponseDto, SearchResultDto } from '../dto/search.dto';

interface TmdbSearchRaw {
  id: number;
  media_type?: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  poster_path?: string | null;
  profile_path?: string | null;
  release_date?: string;
  first_air_date?: string;
}

interface TmdbSearchListRaw {
  page: number;
  total_pages: number;
  results: TmdbSearchRaw[];
}

type ForcedMediaType = 'movie' | 'tv' | 'person';

function buildPosterUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${POSTER_SIZE}${path}`;
}

function buildProfileUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${PROFILE_SIZE}${path}`;
}

function toResultDto(raw: TmdbSearchRaw, forced?: ForcedMediaType): SearchResultDto | null {
  const type = forced ?? raw.media_type;

  if (!type) return null;

  if (type === 'person') {
    return {
      id: raw.id,
      mediaType: 'person',
      title: raw.name ?? '',
      posterUrl: buildProfileUrl(raw.profile_path),
      releaseYear: '',
    };
  }

  const releaseDate = raw.release_date ?? raw.first_air_date ?? '';

  return {
    id: raw.id,
    mediaType: type as 'movie' | 'tv',
    title: raw.title ?? raw.name ?? '',
    posterUrl: buildPosterUrl(raw.poster_path),
    releaseYear: releaseDate.slice(0, 4),
  };
}

export function toSearchResponseDto(
  raw: TmdbSearchListRaw,
  forced?: ForcedMediaType,
): SearchResponseDto {
  const results: SearchResultDto[] = [];

  for (const item of raw.results) {
    const dto = toResultDto(item, forced);
    if (dto && dto.posterUrl) {
      results.push(dto);
    }
  }

  return {
    page: raw.page,
    totalPages: Math.min(raw.total_pages, 500),
    results,
  };
}

export type { TmdbSearchListRaw, ForcedMediaType };
