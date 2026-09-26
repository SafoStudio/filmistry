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
    path: 'people',
    loadComponent: () =>
      import('./features/people/pages/people-page/people-page').then((m) => m.PeoplePage),
  },
  { path: '**', redirectTo: '' },
];
