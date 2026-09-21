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
  },
];
