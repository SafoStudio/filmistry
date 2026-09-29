import {
  Component,
  inject,
  signal,
  effect,
  computed,
  viewChild,
  ElementRef,
  afterNextRender,
  OnDestroy,
} from '@angular/core';
import { MediaService } from '@core/services/media.service';
import { TrendingItem } from '@core/models/trending.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Loader } from '@shared/components/loader/loader';

@Component({
  selector: 'app-movie-trailer-bar',
  imports: [Loader],
  templateUrl: './movie-trailer-bar.html',
  styleUrl: './movie-trailer-bar.scss',
})
export class MovieTrailerBar implements OnDestroy {
  private mediaService = inject(MediaService);
  private sanitizer = inject(DomSanitizer);

  items = signal<TrendingItem[]>([]);
  loading = signal(true);
  currentIndex = signal(0);

  trailerUrl = signal<SafeResourceUrl | null>(null);
  isModalOpen = signal(false);

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private readonly AUTO_MS = 8000;

  visibleItems = computed(() => {
    const all = this.items();
    if (all.length === 0) return [];
    const start = this.currentIndex();
    const result: TrendingItem[] = [];
    for (let i = 0; i < 3; i++) {
      result.push(all[(start + i) % all.length]);
    }
    return result;
  });

  constructor() {
    effect(() => {
      this.mediaService.getTrendingMoviesDay().subscribe({
        next: (data) => {
          this.items.set(data.results);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    });

    afterNextRender(() => {
      this.startAuto();
    });
  }

  ngOnDestroy(): void {
    this.stopAuto();
  }

  private startAuto(): void {
    this.stopAuto();
    this.intervalId = setInterval(() => this.next(), this.AUTO_MS);
  }

  private stopAuto(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  next(): void {
    const len = this.items().length;
    if (len === 0) return;
    this.currentIndex.update((i) => (i + 1) % len);
  }

  prev(): void {
    const len = this.items().length;
    if (len === 0) return;
    this.currentIndex.update((i) => (i - 1 + len) % len);
  }

  openTrailer(item: TrendingItem): void {
    this.stopAuto();
    this.mediaService.getDetail('movie', String(item.id)).subscribe({
      next: (detail) => {
        if (!detail.trailerKey) {
          this.startAuto();
          return;
        }
        this.trailerUrl.set(
          this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${detail.trailerKey}`,
          ),
        );
        this.isModalOpen.set(true);
      },
      error: () => this.startAuto(),
    });
  }

  closeTrailer(): void {
    this.isModalOpen.set(false);
    this.trailerUrl.set(null);
    this.startAuto();
  }

  yearOf(item: TrendingItem): string {
    return '';
  }
}
