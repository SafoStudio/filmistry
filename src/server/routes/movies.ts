import { Router } from 'express';
import { tmdbFetch } from '../tmdb-client';
import { handleApi } from '../api-helpers';
import { DEFAULT_LANGUAGE } from '../constants';
import { toMovieListDto, TmdbMovieListRaw } from '../mappers/movie.mapper';
import { toMovieDetailDto, TmdbMovieDetailRaw } from '../mappers/movie-detail.mapper';
import { toMovieCreditsDto, TmdbCreditsRaw } from '../mappers/movie-credits.mapper';
import { toMovieImagesDto, TmdbImagesRaw } from '../mappers/movie-images.mapper';
import { toMovieReviewsDto, TmdbReviewsRaw } from '../mappers/movie-reviews.mapper';

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

moviesRouter.get(
  '/:id',
  handleApi(async (req) => {
    const id = req.params['id'];
    const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;
    const raw = await tmdbFetch<TmdbMovieDetailRaw>(`/movie/${id}`, {
      language: lang,
      append_to_response: 'videos',
    });
    return toMovieDetailDto(raw);
  }),
);

moviesRouter.get(
  '/:id/credits',
  handleApi(async (req) => {
    const id = req.params['id'];
    const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;
    const raw = await tmdbFetch<TmdbCreditsRaw>(`/movie/${id}/credits`, {
      language: lang,
    });
    return toMovieCreditsDto(raw);
  }),
);

moviesRouter.get(
  '/:id/images',
  handleApi(async (req) => {
    const id = req.params['id'];
    const raw = await tmdbFetch<TmdbImagesRaw>(`/movie/${id}/images`, {
      include_image_language: 'en,null',
    });
    return toMovieImagesDto(raw);
  }),
);

moviesRouter.get(
  '/:id/reviews',
  handleApi(async (req) => {
    const id = req.params['id'];
    const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;
    const raw = await tmdbFetch<TmdbReviewsRaw>(`/movie/${id}/reviews`, {
      language: lang,
    });
    return toMovieReviewsDto(raw);
  }),
);
