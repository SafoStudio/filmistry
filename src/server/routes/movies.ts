import { Router } from 'express';
import { tmdbFetch } from '../tmdb-client';
import { handleApi } from '../api-helpers';
import { DEFAULT_LANGUAGE } from '../constants';
import { toMovieListDto, TmdbMovieListRaw } from '../mappers/movie.mapper';

export const moviesRouter = Router();

moviesRouter.get(
  '/popular',
  handleApi(async (req) => {
    const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;
    const requestedPage = Number(req.query['page']) || 1;
    const page = Math.max(1, Math.min(requestedPage, 500));
    const raw = await tmdbFetch<TmdbMovieListRaw>('/movie/popular', {
      language: lang,
      page,
    });
    return toMovieListDto(raw);
  }),
);
