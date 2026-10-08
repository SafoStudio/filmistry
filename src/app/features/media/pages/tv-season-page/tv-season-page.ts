import { Component, inject, signal, effect, input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MediaService } from '@core/services/media.service';
import { TvSeasonDetail } from '@core/models/tv-season.model';
import { Loader } from '@shared/components/loader/loader';
import { PageCurl } from '@shared/components/page-curl/page-curl';

@Component({
  selector: 'app-tv-season-page',
  imports: [Loader, PageCurl],
  templateUrl: './tv-season-page.html',
  styleUrl: './tv-season-page.scss',
})
export class TvSeasonPage {
  private mediaService = inject(MediaService);
  private router = inject(Router);
  private location = inject(Location);

  id = input.required<string>();
  seasonNumber = input.required<string>();

  season = signal<TvSeasonDetail | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  isClosing = signal(false);

  constructor() {
    effect(() => {
      const tvId = this.id();
      const num = this.seasonNumber();
      if (tvId && num) this.load(tvId, Number(num));
    });
  }

  private load(tvId: string, seasonNumber: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.mediaService.getSeasonDetail(tvId, seasonNumber).subscribe({
      next: (data) => {
        this.season.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load season');
        this.loading.set(false);
      },
    });
  }

  closeDetail(): void {
    if (this.isClosing()) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      this.goBack();
      return;
    }

    this.isClosing.set(true);
    setTimeout(() => this.goBack(), 700);
  }

  private goBack(): void {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/tv', this.id()]);
    }
  }
}
