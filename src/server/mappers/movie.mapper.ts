import { TMDB_IMAGE_BASE_URL, POSTER_SIZE } from '../constants';
import { MovieListDto, MovieListItemDto } from '../dto/movie.dto';

export interface TmdbMovieRaw {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

export interface TmdbMovieListRaw {
  page: number;
  total_pages: number;
  results: TmdbMovieRaw[];
}

function buildPosterUrl(posterPath: string | null): string | null {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE_URL}/${POSTER_SIZE}${posterPath}`;
}

function extractYear(releaseDate: string): string {
  return releaseDate?.slice(0, 4) ?? '';
}

function toMovieListItemDto(raw: TmdbMovieRaw): MovieListItemDto {
  return {
    id: raw.id,
    title: raw.title,
    posterUrl: buildPosterUrl(raw.poster_path),
    releaseYear: extractYear(raw.release_date),
  };
}

export function toMovieListDto(raw: TmdbMovieListRaw): MovieListDto {
  return {
    page: raw.page,
    totalPages: raw.total_pages,
    results: raw.results.map(toMovieListItemDto),
  };
}
