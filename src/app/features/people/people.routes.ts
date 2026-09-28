import { Routes } from '@angular/router';

export const peopleRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/people-page/people-page').then((m) => m.PeoplePage),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/person-detail-page/person-detail-page').then((m) => m.PersonDetailPage),
  },
];
