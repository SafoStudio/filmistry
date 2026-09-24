import { Router } from 'express';
import { tmdbFetch } from '../tmdb-client';
import { handleApi } from '../api-helpers';
import { DEFAULT_LANGUAGE } from '../constants';
import { toTrendingDto } from '../mappers/trending.mapper';

interface TmdbTrendingListRaw {
  results: any[];
}

export const trendingRouter = Router();

trendingRouter.get(
  '/',
  handleApi(async (req) => {
    const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;
    const raw = await tmdbFetch<TmdbTrendingListRaw>('/trending/all/week', {
      language: lang,
    });
    return toTrendingDto(raw);
  }),
);
