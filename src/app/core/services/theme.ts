import { Service, signal, effect } from '@angular/core';

export type Theme = 'sepia' | 'dark';

const STORAGE_KEY = 'filmistry-theme';
const DEFAULT_THEME: Theme = 'dark';

@Service()
export class ThemeService {
  private readonly _theme = signal<Theme>(DEFAULT_THEME);
  readonly theme = this._theme.asReadonly();

  constructor() {
    effect(() => {
      const theme = this._theme();
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
      }
    });
  }

  setTheme(theme: Theme): void {
    this._theme.set(theme);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }

  toggle(): void {
    this.setTheme(this._theme() === 'dark' ? 'sepia' : 'dark');
  }

  init(): void {
    if (typeof localStorage === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === 'sepia' || stored === 'dark') {
      this._theme.set(stored);
    }
  }
}
