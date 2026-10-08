import { Router } from 'express';
import { tmdbFetch } from '../tmdb-client';
import { handleApi } from '../api-helpers';
import { DEFAULT_LANGUAGE } from '../constants';
import { toCollectionDto, TmdbCollectionRaw } from '../mappers/collection.mapper';

export const collectionsRouter = Router();

collectionsRouter.get(
  '/:id',
  handleApi(async (req) => {
    const id = req.params['id'];
    const lang = (req.query['lang'] as string) || DEFAULT_LANGUAGE;

    const raw = await tmdbFetch<TmdbCollectionRaw>(`/collection/${id}`, {
      language: lang,
    });

    return toCollectionDto(raw);
  }),
);
