import { Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme';
import { Header } from './shared/components/header/header';
import { ScrollToTop } from './shared/components/scroll-to-top/scroll-to-top';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, ScrollToTop],
  templateUrl: './app.html',
})
export class App {
  private themeService = inject(ThemeService);

  constructor() {
    afterNextRender(() => {
      this.themeService.init();
    });
  }
}
