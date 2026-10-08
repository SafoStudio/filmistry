import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then((m) => m.homeRoutes),
  },
  {
    path: 'movies',
    loadChildren: () => import('./features/media/media.routes').then((m) => m.movieRoutes),
  },
  {
    path: 'tv',
    loadChildren: () => import('./features/media/media.routes').then((m) => m.tvRoutes),
  },
  {
    path: 'anime',
    loadChildren: () => import('./features/media/media.routes').then((m) => m.animeRoutes),
  },
  {
    path: 'cartoons',
    loadChildren: () => import('./features/media/media.routes').then((m) => m.cartoonsRoutes),
  },
  {
    path: 'people',
    loadChildren: () => import('./features/people/people.routes').then((m) => m.peopleRoutes),
  },
  {
    path: 'search',
    loadChildren: () => import('./features/search/search.routes').then((m) => m.searchRoutes),
  },
  {
    path: 'collection',
    loadChildren: () => import('./features/media/media.routes').then((m) => m.collectionRoutes),
  },
  { path: '**', redirectTo: '' },
];
