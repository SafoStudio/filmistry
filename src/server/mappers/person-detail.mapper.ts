import { TMDB_IMAGE_BASE_URL, PROFILE_SIZE } from '../constants';
import { PersonDetailDto } from '../dto/person-detail.dto';

export interface TmdbPersonDetailRaw {
  id: number;
  name: string;
  profile_path: string | null;
  birthday: string | null;
  place_of_birth: string | null;
  biography: string | null;
}

function buildProfileUrl(path: string | null): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${PROFILE_SIZE}${path}`;
}

export function toPersonDetailDto(raw: TmdbPersonDetailRaw): PersonDetailDto {
  return {
    id: raw.id,
    name: raw.name,
    profileUrl: buildProfileUrl(raw.profile_path),
    birthday: raw.birthday ?? null,
    placeOfBirth: raw.place_of_birth ?? null,
    biography: raw.biography ?? null,
  };
}
