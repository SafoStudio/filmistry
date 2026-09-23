import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-theme-toggle',
  imports: [Icon],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
})
export class ThemeToggle {
  themeService = inject(ThemeService);
}
