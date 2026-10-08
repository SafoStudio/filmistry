import { Routes } from '@angular/router';

const mediaChildren: Routes = [
  {
    path: 'cast',
    loadComponent: () =>
      import('./pages/media-detail-page/sections/cast/cast-section').then((m) => m.CastSection),
  },
  {
    path: 'gallery',
    loadComponent: () =>
      import('./pages/media-detail-page/sections/gallery/gallery-section').then(
        (m) => m.GallerySection,
      ),
  },
  {
    path: 'reviews',
    loadComponent: () =>
      import('./pages/media-detail-page/sections/reviews/reviews-section').then(
        (m) => m.ReviewsSection,
      ),
  },
];

export const movieRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/media-page/media-page').then((m) => m.MediaPage),
    data: { mediaType: 'movie' },
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/media-detail-page/media-detail-page').then((m) => m.MediaDetailPage),
    data: { mediaType: 'movie' },
    children: mediaChildren,
  },
];

export const tvRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/media-page/media-page').then((m) => m.MediaPage),
    data: { mediaType: 'tv' },
  },
  {
    path: ':id/season/:seasonNumber',
    loadComponent: () =>
      import('./pages/tv-season-page/tv-season-page').then((m) => m.TvSeasonPage),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/media-detail-page/media-detail-page').then((m) => m.MediaDetailPage),
    data: { mediaType: 'tv' },
    children: mediaChildren,
  },
];

export const animeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/media-page/media-page').then((m) => m.MediaPage),
    data: { mediaType: 'movie', preset: 'anime' },
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/media-detail-page/media-detail-page').then((m) => m.MediaDetailPage),
    data: { mediaType: 'tv' },
    children: mediaChildren,
  },
];

export const cartoonsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/media-page/media-page').then((m) => m.MediaPage),
    data: { mediaType: 'movie', preset: 'cartoons' },
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/media-detail-page/media-detail-page').then((m) => m.MediaDetailPage),
    data: { mediaType: 'movie' },
    children: mediaChildren,
  },
];

export const collectionRoutes: Routes = [
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/collection-page/collection-page').then((m) => m.CollectionPage),
  },
];

