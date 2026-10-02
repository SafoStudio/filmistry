import { Router } from 'express';
import { tmdbFetch } from '../tmdb-client';
import { handleApi } from '../api-helpers';
import { DEFAULT_LANGUAGE } from '../constants';
import { toMediaListDto, TmdbMediaListRaw } from '../mappers/media-list.mapper';

export const discoverRouter = Router();

const ALLOWED_SORT = new Set([
  'popularity.desc',
  'popularity.asc',
  'vote_average.desc',
  'vote_average.asc',
  'primary_release_date.desc',
  'primary_release_date.asc',
  'first_air_date.desc',
  'first_air_date.asc',
  'title.asc',
  'title.desc',
  'name.asc',
  'name.desc',
]);

function parseYear(value: unknown): number | undefined {
  const num = Number(value);
  if (!Number.isFinite(num)) return undefined;
  if (num < 1900 || num > 2100) return undefined;
  return num;
}

function parseRating(value: unknown): number | undefined {
  const num = Number(value);
  if (!Number.isFinite(num)) return undefined;
  if (num < 0 || num > 10) return undefined;
  return num;
}

function buildBaseParams(req: any) {
  const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;
  const requestedPage = Number(req.query['page']) || 1;
  const page = Math.max(1, Math.min(requestedPage, 500));

  const sortRaw = (req.query['sort'] as string) || 'popularity.desc';
  const sortBy = ALLOWED_SORT.has(sortRaw) ? sortRaw : 'popularity.desc';

  const genres = (req.query['genres'] as string) || '';
  const country = (req.query['country'] as string) || '';
  const language = (req.query['language'] as string) || '';
  const year = parseYear(req.query['year']);
  const ratingGte = parseRating(req.query['rating']);

  return { lang, page, sortBy, genres, country, language, year, ratingGte };
}

discoverRouter.get(
  '/movie',
  handleApi(async (req) => {
    const { lang, page, sortBy, genres, country, language, year, ratingGte } = buildBaseParams(req);

    const params: Record<string, string | number> = {
      language: lang,
      page,
      sort_by: sortBy,
      include_adult: 'false',
    };

    if (genres) params['with_genres'] = genres;
    if (country && country !== 'foreign') params['with_origin_country'] = country;
    if (language) params['with_original_language'] = language;
    if (year) params['primary_release_year'] = year;
    if (ratingGte !== undefined) {
      params['vote_average.gte'] = ratingGte;
      params['vote_count.gte'] = 100;
    }

    const raw = await tmdbFetch<TmdbMediaListRaw>('/discover/movie', params);
    return toMediaListDto(raw);
  }),
);

discoverRouter.get(
  '/tv',
  handleApi(async (req) => {
    const { lang, page, sortBy, genres, country, language, year, ratingGte } = buildBaseParams(req);

    const params: Record<string, string | number> = {
      language: lang,
      page,
      sort_by: sortBy,
      include_adult: 'false',
    };

    if (genres) params['with_genres'] = genres;
    if (country && country !== 'foreign') params['with_origin_country'] = country;
    if (language) params['with_original_language'] = language;
    if (year) params['first_air_date_year'] = year;
    if (ratingGte !== undefined) {
      params['vote_average.gte'] = ratingGte;
      params['vote_count.gte'] = 100;
    }

    const raw = await tmdbFetch<TmdbMediaListRaw>('/discover/tv', params);
    return toMediaListDto(raw);
  }),
);
