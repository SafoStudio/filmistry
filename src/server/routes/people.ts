import { Router } from 'express';
import { tmdbFetch } from '../tmdb-client';
import { handleApi } from '../api-helpers';
import { DEFAULT_LANGUAGE } from '../constants';
import { toPersonListDto } from '../mappers/person.mapper';
import { toPersonDetailDto, TmdbPersonDetailRaw } from '../mappers/person-detail.mapper';
import { toPersonCreditsDto, TmdbPersonCreditsRaw } from '../mappers/person-credits.mapper';

interface TmdbPersonListRaw {
  results: any[];
}

export const peopleRouter = Router();

peopleRouter.get(
  '/popular',
  handleApi(async (req) => {
    const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;
    const raw = await tmdbFetch<TmdbPersonListRaw>('/person/popular', {
      language: lang,
    });
    return toPersonListDto(raw);
  }),
);

peopleRouter.get(
  '/:id',
  handleApi(async (req) => {
    const id = req.params['id'];
    const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;
    const raw = await tmdbFetch<TmdbPersonDetailRaw>(`/person/${id}`, {
      language: lang,
    });
    return toPersonDetailDto(raw);
  }),
);

peopleRouter.get(
  '/:id/credits',
  handleApi(async (req) => {
    const id = req.params['id'];
    const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;
    const raw = await tmdbFetch<TmdbPersonCreditsRaw>(`/person/${id}/combined_credits`, {
      language: lang,
    });
    return toPersonCreditsDto(raw);
  }),
);
