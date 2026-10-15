import { InjectionToken } from '@angular/core';

export interface LightboxData {
  images: string[];
  startIndex: number;
}

export const LIGHTBOX_DATA = new InjectionToken<LightboxData>('LIGHTBOX_DATA');
