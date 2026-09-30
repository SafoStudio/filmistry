import { TMDB_BASE_URL } from './constants';
import { TmdbConfigError, TmdbRequestError } from './errors';

interface CacheEntry {
  data: unknown;
  expires: number;
}

const cache = new Map<string, CacheEntry>();
const DEFAULT_TTL = 60_000;
const MAX_CACHE_SIZE = 500;

export async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number> = {},
): Promise<T> {
  const token = process.env['TMDB_ACCESS_TOKEN'];

  if (!token) {
    throw new TmdbConfigError('TMDB token not configured');
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const urlString = url.toString();
  const now = Date.now();

  const cached = cache.get(urlString);
  if (cached && cached.expires > now) {
    return cached.data as T;
  }

  const response = await fetch(urlString, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new TmdbRequestError(response.status);
  }

  const data = await response.json();

  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) {
      cache.delete(firstKey);
    }
  }

  cache.set(urlString, {
    data,
    expires: now + DEFAULT_TTL,
  });

  return data as T;
}
