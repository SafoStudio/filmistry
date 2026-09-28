import { TMDB_IMAGE_BASE_URL, POSTER_SIZE } from '../constants';
import { PersonCreditDto, PersonCreditsDto } from '../dto/person-credits.dto';

interface TmdbCreditRaw {
  id: number;
  media_type: 'movie' | 'tv';
  title?: string;
  name?: string;
  poster_path: string | null;
  character?: string | null;
}

export interface TmdbPersonCreditsRaw {
  cast: TmdbCreditRaw[];
}

function buildPosterUrl(path: string | null): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${POSTER_SIZE}${path}`;
}

function toPersonCreditDto(raw: TmdbCreditRaw): PersonCreditDto {
  return {
    id: raw.id,
    mediaType: raw.media_type,
    title: raw.title ?? raw.name ?? '',
    posterUrl: buildPosterUrl(raw.poster_path),
    character: raw.character ?? null,
  };
}

export function toPersonCreditsDto(raw: TmdbPersonCreditsRaw): PersonCreditsDto {
  return {
    credits: raw.cast
      .filter((c) => c.media_type === 'movie' || c.media_type === 'tv')
      .filter((c) => c.poster_path)
      .map(toPersonCreditDto),
  };
}
