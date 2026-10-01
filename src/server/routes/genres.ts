import { Router } from 'express';
import { tmdbFetch } from '../tmdb-client';
import { handleApi } from '../api-helpers';
import { DEFAULT_LANGUAGE } from '../constants';
import { toGenreListDto } from '../mappers/genre.mapper';

interface TmdbGenreListRaw {
  genres: any[];
}

export const genresRouter = Router();

genresRouter.get(
  '/movie',
  handleApi(async (req) => {
    const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;
    const raw = await tmdbFetch<TmdbGenreListRaw>('/genre/movie/list', {
      language: lang,
    });
    return toGenreListDto(raw);
  }),
);

genresRouter.get(
  '/tv',
  handleApi(async (req) => {
    const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;
    const raw = await tmdbFetch<TmdbGenreListRaw>('/genre/tv/list', {
      language: lang,
    });
    return toGenreListDto(raw);
  }),
);
