import { Routes } from '@angular/router';

export const tvRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/tv-page/tv-page').then((m) => m.TvPage),
  },
];
