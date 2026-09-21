import { Router } from 'express';
import { tmdbFetch } from '../tmdb-client';
import { handleApi } from '../api-helpers';
import { DEFAULT_LANGUAGE } from '../constants';

export const moviesRouter = Router();

moviesRouter.get(
  '/popular',
  handleApi(async (req) => {
    const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;
    return tmdbFetch('/movie/popular', { language: lang });
  })
);
