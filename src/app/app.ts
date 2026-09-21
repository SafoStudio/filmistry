import { Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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
