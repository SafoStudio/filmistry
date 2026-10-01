import { Router } from 'express';
import { tmdbFetch } from '../tmdb-client';
import { handleApi } from '../api-helpers';
import { DEFAULT_LANGUAGE } from '../constants';
import { toSearchResponseDto } from '../mappers/search.mapper';

interface TmdbSearchListRaw {
  page: number;
  total_pages: number;
  results: any[];
}

export const searchRouter = Router();

const MIN_QUERY_LENGTH = 2;

function parseQuery(req: any): string {
  return ((req.query['q'] as string) ?? '').trim();
}

function parsePage(req: any): number {
  const requested = Number(req.query['page']) || 1;
  return Math.max(1, Math.min(requested, 500));
}

function parseLang(req: any): string {
  return (req.query['lang'] as string) || DEFAULT_LANGUAGE;
}

const EMPTY_RESPONSE = { page: 1, totalPages: 0, results: [] };

searchRouter.get(
  '/multi',
  handleApi(async (req) => {
    const query = parseQuery(req);
    if (query.length < MIN_QUERY_LENGTH) return EMPTY_RESPONSE;

    const raw = await tmdbFetch<TmdbSearchListRaw>('/search/multi', {
      query,
      language: parseLang(req),
      page: parsePage(req),
      include_adult: 'false',
    });

    return toSearchResponseDto(raw);
  }),
);

searchRouter.get(
  '/movie',
  handleApi(async (req) => {
    const query = parseQuery(req);
    if (query.length < MIN_QUERY_LENGTH) return EMPTY_RESPONSE;

    const raw = await tmdbFetch<TmdbSearchListRaw>('/search/movie', {
      query,
      language: parseLang(req),
      page: parsePage(req),
      include_adult: 'false',
    });

    return toSearchResponseDto(raw, 'movie');
  }),
);

searchRouter.get(
  '/tv',
  handleApi(async (req) => {
    const query = parseQuery(req);
    if (query.length < MIN_QUERY_LENGTH) return EMPTY_RESPONSE;

    const raw = await tmdbFetch<TmdbSearchListRaw>('/search/tv', {
      query,
      language: parseLang(req),
      page: parsePage(req),
      include_adult: 'false',
    });

    return toSearchResponseDto(raw, 'tv');
  }),
);

searchRouter.get(
  '/person',
  handleApi(async (req) => {
    const query = parseQuery(req);
    if (query.length < MIN_QUERY_LENGTH) return EMPTY_RESPONSE;

    const raw = await tmdbFetch<TmdbSearchListRaw>('/search/person', {
      query,
      language: parseLang(req),
      page: parsePage(req),
      include_adult: 'false',
    });

    return toSearchResponseDto(raw, 'person');
  }),
);
