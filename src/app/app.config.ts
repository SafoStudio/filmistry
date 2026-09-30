import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  RouteReuseStrategy,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';
import { cacheInterceptor } from '@core/interceptors/cache.interceptor';

class NoReuseStrategy implements RouteReuseStrategy {
  shouldDetach(_route: ActivatedRouteSnapshot): boolean {
    return false;
  }
  store(_route: ActivatedRouteSnapshot, _handle: DetachedRouteHandle | null): void {}
  shouldAttach(_route: ActivatedRouteSnapshot): boolean {
    return false;
  }
  retrieve(_route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }
  shouldReuseRoute(_future: ActivatedRouteSnapshot, _curr: ActivatedRouteSnapshot): boolean {
    return false;
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([cacheInterceptor])),
    provideClientHydration(),
    { provide: RouteReuseStrategy, useClass: NoReuseStrategy },
  ],
};
