import { Injectable } from '@angular/core';

interface PageState<T = unknown> {
  data: T;
  timestamp: number;
}

const DEFAULT_TTL = 5 * 60 * 1000;
const MAX_ENTRIES = 20;

@Injectable({ providedIn: 'root' })
export class NavigationStateService {
  private readonly cache = new Map<string, PageState>();

  save<T>(url: string, data: T): void {
    if (this.cache.size >= MAX_ENTRIES) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(url, {
      data,
      timestamp: Date.now(),
    });
  }

  get<T>(url: string, ttl: number = DEFAULT_TTL): PageState<T> | null {
    const entry = this.cache.get(url);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > ttl) {
      this.cache.delete(url);
      return null;
    }

    return entry as PageState<T>;
  }

  clear(url: string): void {
    this.cache.delete(url);
  }

  clearAll(): void {
    this.cache.clear();
  }
}
