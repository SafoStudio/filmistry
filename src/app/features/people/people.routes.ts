import { Routes } from '@angular/router';

export const peopleRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/people-page/people-page').then((m) => m.PeoplePage),
  },
];
