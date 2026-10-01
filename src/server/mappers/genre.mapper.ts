import { GenreDto, GenreListDto } from '../dto/genre.dto';

interface TmdbGenreRaw {
  id: number;
  name: string;
}

interface TmdbGenreListRaw {
  genres: TmdbGenreRaw[];
}

export function toGenreListDto(raw: TmdbGenreListRaw): GenreListDto {
  return {
    genres: raw.genres.map((g): GenreDto => ({
      id: g.id,
      name: g.name,
    })),
  };
}
