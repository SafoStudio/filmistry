import { Router } from 'express';
import { tmdbFetch } from '../tmdb-client';
import { handleApi } from '../api-helpers';
import { DEFAULT_LANGUAGE } from '../constants';
import { toMediaListDto, TmdbMediaListRaw } from '../mappers/media-list.mapper';
import { toMediaDetailDto, TmdbMediaDetailRaw } from '../mappers/media-detail.mapper';
import { toMediaCreditsDto, TmdbMediaCreditsRaw } from '../mappers/media-credits.mapper';
import { toMediaImagesDto, TmdbMediaImagesRaw } from '../mappers/media-images.mapper';
import { toMediaReviewsDto, TmdbMediaReviewsRaw } from '../mappers/media-reviews.mapper';

export const moviesRouter = Router();

moviesRouter.get(
  '/popular',
  handleApi(async (req) => {
    const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;
    const requestedPage = Number(req.query['page']) || 1;
    const page = Math.max(1, Math.min(requestedPage, 500));
    const raw = await tmdbFetch<TmdbMediaListRaw>('/movie/popular', {
      language: lang,
      page,
    });
    return toMediaListDto(raw);
  }),
);

moviesRouter.get(
  '/:id',
  handleApi(async (req) => {
    const id = req.params['id'];
    const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;
    const raw = await tmdbFetch<TmdbMediaDetailRaw>(`/movie/${id}`, {
      language: lang,
      append_to_response: 'videos,recommendations',
    });
    return toMediaDetailDto(raw);
  }),
);

moviesRouter.get(
  '/:id/credits',
  handleApi(async (req) => {
    const id = req.params['id'];
    const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;
    const raw = await tmdbFetch<TmdbMediaCreditsRaw>(`/movie/${id}/credits`, {
      language: lang,
    });
    return toMediaCreditsDto(raw);
  }),
);

moviesRouter.get(
  '/:id/images',
  handleApi(async (req) => {
    const id = req.params['id'];
    const raw = await tmdbFetch<TmdbMediaImagesRaw>(`/movie/${id}/images`, {
      include_image_language: 'en,null',
    });
    return toMediaImagesDto(raw);
  }),
);

moviesRouter.get(
  '/:id/reviews',
  handleApi(async (req) => {
    const id = req.params['id'];
    const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;
    const raw = await tmdbFetch<TmdbMediaReviewsRaw>(`/movie/${id}/reviews`, {
      language: lang,
    });
    return toMediaReviewsDto(raw);
  }),
);
