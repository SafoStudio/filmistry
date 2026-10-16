import {
  Component,
  inject,
  signal,
  effect,
  computed,
  output,
  afterNextRender,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { MediaService } from '@core/services/media.service';
import { TrendingItem } from '@core/models/trending.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Loader } from '@shared/components/loader/loader';
import { Icon } from '@shared/components/icon/icon';

@Component({
  selector: 'app-movie-trailer-bar',
  imports: [Loader, Icon],
  templateUrl: './movie-trailer-bar.html',
  styleUrl: './movie-trailer-bar.scss',
})
export class MovieTrailerBar implements OnDestroy {
  private mediaService = inject(MediaService);
  private sanitizer = inject(DomSanitizer);

  loaded = output<void>();

  items = signal<TrendingItem[]>([]);
  loading = signal(true);
  currentIndex = signal(0);
  visibleCount = signal(1);
  isFading = signal(false);

  trailerUrl = signal<SafeResourceUrl | null>(null);
  isModalOpen = signal(false);

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private readonly AUTO_MS = 8000;
  private isNavigating = false;

  visibleItems = computed(() => {
    const all = this.items();
    const count = this.visibleCount();
    if (all.length === 0) return [];
    if (all.length <= count) return all;

    const start = this.currentIndex();
    const result: TrendingItem[] = [];
    for (let i = 0; i < count; i++) {
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
          this.loaded.emit();
          if (typeof window !== 'undefined') {
            setTimeout(() => this.preloadUpcoming(), 50);
          }
        },
        error: () => {
          this.loading.set(false);
          this.loaded.emit();
        },
      });
    });

    effect(() => {
      if (typeof document === 'undefined') return;
      document.body.style.overflow = this.isModalOpen() ? 'hidden' : '';
    });

    afterNextRender(() => {
      this.updateVisibleCount();
      this.startAuto();
    });
  }

  ngOnDestroy(): void {
    this.stopAuto();
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.isModalOpen()) {
      this.closeTrailer();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateVisibleCount();
  }

  private updateVisibleCount(): void {
    if (typeof window === 'undefined') return;
    const w = window.innerWidth;

    if (w < 600) {
      this.visibleCount.set(1);
    } else if (w < 1000) {
      this.visibleCount.set(2);
    } else {
      this.visibleCount.set(3);
    }
  }

  private startAuto(): void {
    this.stopAuto();
    this.intervalId = setInterval(() => {
      if (!this.isModalOpen() && !this.isNavigating) {
        this.next();
      }
    }, this.AUTO_MS);
  }

  private stopAuto(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private preloadImages(urls: string[]): Promise<void> {
    if (typeof window === 'undefined' || urls.length === 0) {
      return Promise.resolve();
    }

    const promises = urls.map((url) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = url;
        if (img.complete && img.naturalWidth > 0) {
          resolve();
          return;
        }
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    });

    const timeout = new Promise<void>((resolve) => setTimeout(resolve, 1200));
    return Promise.race([Promise.all(promises).then(() => {}), timeout]);
  }

  private preloadUpcoming(): void {
    if (typeof window === 'undefined') return;
    const all = this.items();
    if (all.length === 0) return;

    const count = this.visibleCount();
    const curr = this.currentIndex();
    const nextStart = (curr + 1) % all.length;
    const prevStart = (curr - 1 + all.length) % all.length;

    const urls: string[] = [];
    for (let i = 0; i < count; i++) {
      const nextItem = all[(nextStart + i) % all.length];
      const prevItem = all[(prevStart + i) % all.length];
      if (nextItem?.backdropUrl) urls.push(nextItem.backdropUrl);
      if (prevItem?.backdropUrl) urls.push(prevItem.backdropUrl);
    }

    for (const url of urls) {
      const img = new Image();
      img.src = url;
    }
  }

  private async transitionTo(targetIndex: number): Promise<void> {
    const all = this.items();
    if (all.length === 0 || this.isNavigating) return;

    this.isNavigating = true;

    const count = this.visibleCount();
    const targetUrls: string[] = [];
    for (let i = 0; i < count; i++) {
      const item = all[(targetIndex + i) % all.length];
      if (item?.backdropUrl) {
        targetUrls.push(item.backdropUrl);
      }
    }

    this.isFading.set(true);

    await Promise.all([
      this.preloadImages(targetUrls),
      new Promise((res) => setTimeout(res, 140)),
    ]);

    this.currentIndex.set(targetIndex);

    requestAnimationFrame(() => {
      this.isFading.set(false);
      this.isNavigating = false;
      this.preloadUpcoming();
    });
  }

  async next(): Promise<void> {
    const len = this.items().length;
    if (len === 0 || this.isNavigating) return;
    const target = (this.currentIndex() + 1) % len;
    await this.transitionTo(target);
  }

  async prev(): Promise<void> {
    const len = this.items().length;
    if (len === 0 || this.isNavigating) return;
    const target = (this.currentIndex() - 1 + len) % len;
    await this.transitionTo(target);
  }

  onUserNext(): void {
    this.startAuto();
    this.next();
  }

  onUserPrev(): void {
    this.startAuto();
    this.prev();
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
}
