import { TMDB_IMAGE_BASE_URL, PROFILE_SIZE } from '../constants';
import { CastMemberDto, MediaCreditsDto } from '../dto/media-credits.dto';

interface TmdbCastRaw {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TmdbMediaCreditsRaw {
  cast: TmdbCastRaw[];
}

const MAX_CAST = 15;

function buildProfileUrl(path: string | null): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${PROFILE_SIZE}${path}`;
}

export function toMediaCreditsDto(raw: TmdbMediaCreditsRaw): MediaCreditsDto {
  return {
    cast: raw.cast.slice(0, MAX_CAST).map((c): CastMemberDto => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profileUrl: buildProfileUrl(c.profile_path),
    })),
  };
}
