import { Router } from 'express';
import { tmdbFetch } from '../tmdb-client';
import { handleApi } from '../api-helpers';
import { DEFAULT_LANGUAGE } from '../constants';
import { toMediaListDto, TmdbMediaListRaw } from '../mappers/media-list.mapper';
import { toMediaDetailDto, TmdbMediaDetailRaw } from '../mappers/media-detail.mapper';
import { toMediaCreditsDto, TmdbMediaCreditsRaw } from '../mappers/media-credits.mapper';
import { toMediaImagesDto, TmdbMediaImagesRaw } from '../mappers/media-images.mapper';
import { toMediaReviewsDto, TmdbMediaReviewsRaw } from '../mappers/media-reviews.mapper';

export const tvRouter = Router();

tvRouter.get(
  '/top-rated',
  handleApi(async (req) => {
    const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;
    const requestedPage = Number(req.query['page']) || 1;
    const page = Math.max(1, Math.min(requestedPage, 500));
    const raw = await tmdbFetch<TmdbMediaListRaw>('/tv/top_rated', {
      language: lang,
      page,
    });
    return toMediaListDto(raw);
  }),
);

tvRouter.get(
  '/:id',
  handleApi(async (req) => {
    const id = req.params['id'];
    const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;
    const raw = await tmdbFetch<TmdbMediaDetailRaw>(`/tv/${id}`, {
      language: lang,
      append_to_response: 'videos,recommendations',
    });
    return toMediaDetailDto(raw);
  }),
);

tvRouter.get(
  '/:id/credits',
  handleApi(async (req) => {
    const id = req.params['id'];
    const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;
    const raw = await tmdbFetch<TmdbMediaCreditsRaw>(`/tv/${id}/credits`, {
      language: lang,
    });
    return toMediaCreditsDto(raw);
  }),
);

tvRouter.get(
  '/:id/images',
  handleApi(async (req) => {
    const id = req.params['id'];
    const raw = await tmdbFetch<TmdbMediaImagesRaw>(`/tv/${id}/images`, {
      include_image_language: 'en,null',
    });
    return toMediaImagesDto(raw);
  }),
);

tvRouter.get(
  '/:id/reviews',
  handleApi(async (req) => {
    const id = req.params['id'];
    const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;
    const raw = await tmdbFetch<TmdbMediaReviewsRaw>(`/tv/${id}/reviews`, {
      language: lang,
    });
    return toMediaReviewsDto(raw);
  }),
);
