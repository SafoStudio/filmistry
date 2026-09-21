import { TMDB_BASE_URL } from './constants';
import { TmdbConfigError, TmdbRequestError } from './errors';

export async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number> = {}
): Promise<T> {
  const token = process.env['TMDB_ACCESS_TOKEN'];
  if (!token) throw new TmdbConfigError('TMDB token not configured');

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    },
  });

  if (!response.ok) throw new TmdbRequestError(response.status);
  return await response.json() as Promise<T>;
}
