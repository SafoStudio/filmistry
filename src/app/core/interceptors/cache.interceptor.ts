import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

interface CacheEntry {
  response: HttpResponse<unknown>;
  expires: number;
}

const cache = new Map<string, CacheEntry>();
const DEFAULT_TTL = 5 * 60 * 1000;
const MAX_ENTRIES = 100;

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') {
    return next(req);
  }

  if (req.headers.has('X-Skip-Cache')) {
    return next(req);
  }

  const key = req.urlWithParams;
  const now = Date.now();

  const cached = cache.get(key);
  if (cached && cached.expires > now) {
    return of(cached.response.clone());
  }

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          if (cache.size >= MAX_ENTRIES) {
            const firstKey = cache.keys().next().value;
            if (firstKey !== undefined) {
              cache.delete(firstKey);
            }
          }

          cache.set(key, {
            response: event.clone(),
            expires: now + DEFAULT_TTL,
          });
        }
      },
      error: (_err: HttpErrorResponse) => {
        cache.delete(key);
      },
    }),
  );
};

export function clearHttpCache(): void {
  cache.clear();
}

export function clearHttpCacheEntry(url: string): void {
  cache.delete(url);
}
