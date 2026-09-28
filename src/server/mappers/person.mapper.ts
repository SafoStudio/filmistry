import { TMDB_IMAGE_BASE_URL, PROFILE_SIZE } from '../constants';
import { PersonListDto, PersonListItemDto } from '../dto/person.dto';

interface TmdbPersonRaw {
  id: number;
  name: string;
  profile_path: string | null;
}

interface TmdbPersonListRaw {
  results: TmdbPersonRaw[];
}

function buildProfileUrl(path: string | null): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${PROFILE_SIZE}${path}`;
}

function toPersonListItemDto(raw: TmdbPersonRaw): PersonListItemDto {
  return {
    id: raw.id,
    name: raw.name,
    profileUrl: buildProfileUrl(raw.profile_path),
  };
}

export function toPersonListDto(raw: TmdbPersonListRaw): PersonListDto {
  return {
    results: raw.results
      .filter((p) => p.profile_path)
      .slice(0, 20)
      .map(toPersonListItemDto),
  };
}
