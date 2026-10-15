import { InjectionToken } from '@angular/core';

export interface LightboxData {
  paths: string[];
  startIndex: number;
}

export const LIGHTBOX_DATA = new InjectionToken<LightboxData>('LIGHTBOX_DATA');
