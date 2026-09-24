import { TMDB_IMAGE_BASE_URL, BACKDROP_SIZE, POSTER_SIZE } from '../constants';
import { TrendingDto, TrendingItemDto } from '../dto/trending.dto';

interface TmdbTrendingRaw {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  backdrop_path: string | null;
  poster_path: string | null;
}

interface TmdbTrendingListRaw {
  results: TmdbTrendingRaw[];
}

function buildUrl(path: string | null, size: string): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function toTrendingDto(raw: TmdbTrendingListRaw): TrendingDto {
  return {
    results: raw.results
      .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
      .map((item): TrendingItemDto => ({
        id: item.id,
        mediaType: item.media_type as 'movie' | 'tv',
        title: item.title ?? item.name ?? '',
        backdropUrl: buildUrl(item.backdrop_path, BACKDROP_SIZE),
        posterUrl: buildUrl(item.poster_path, POSTER_SIZE),
      })),
  };
}
