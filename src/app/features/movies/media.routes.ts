import { Routes } from '@angular/router';

export const moviesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/movies-page/movies-page').then((m) => m.MoviesPage),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/movie-detail-page/movie-detail-page').then((m) => m.MovieDetailPage),
    children: [
      {
        path: 'cast',
        loadComponent: () =>
          import('./pages/movie-detail-page/sections/cast/cast-section').then((m) => m.CastSection),
      },
      {
        path: 'gallery',
        loadComponent: () =>
          import('./pages/movie-detail-page/sections/gallery/gallery-section').then(
            (m) => m.GallerySection,
          ),
      },
      {
        path: 'reviews',
        loadComponent: () =>
          import('./pages/movie-detail-page/sections/reviews/reviews-section').then(
            (m) => m.ReviewsSection,
          ),
      },
    ],
  },
];
