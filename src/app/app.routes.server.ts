import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server },
  { path: 'movies', renderMode: RenderMode.Server },
  { path: 'movies/:id', renderMode: RenderMode.Server },
  { path: 'movies/:id/cast', renderMode: RenderMode.Server },
  { path: 'movies/:id/gallery', renderMode: RenderMode.Server },
  { path: 'movies/:id/reviews', renderMode: RenderMode.Server },
  { path: 'tv', renderMode: RenderMode.Server },
  { path: 'tv/:id', renderMode: RenderMode.Server },
  { path: 'tv/:id/cast', renderMode: RenderMode.Server },
  { path: 'tv/:id/gallery', renderMode: RenderMode.Server },
  { path: 'tv/:id/reviews', renderMode: RenderMode.Server },
  { path: 'people', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server },
];
