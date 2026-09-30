import { Component, inject, signal, effect, computed, input, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { MediaService, MediaType } from '@core/services/media.service';
import { NavigationStateService } from '@core/services/navigation-state.service';
import { MediaDetail } from '@core/models/media-detail.model';
import { RatingBar } from '@shared/components/rating-bar/rating-bar';
import { Icon } from '@shared/components/icon/icon';
import { Loader } from '@shared/components/loader/loader';
import { PageCurl } from '@shared/components/page-curl/page-curl';
import { RecommendationsSection } from './sections/recommendations/recommendations';

type DetailSection = 'cast' | 'gallery' | 'reviews' | null;

interface MediaDetailState {
  item: MediaDetail;
}

@Component({
  selector: 'app-media-detail-page',
  imports: [RouterOutlet, RatingBar, Icon, Loader, PageCurl, RecommendationsSection],
  templateUrl: './media-detail-page.html',
  styleUrl: './media-detail-page.scss',
})
export class MediaDetailPage implements OnDestroy {
  private mediaService = inject(MediaService);
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);
  private location = inject(Location);
  private navState = inject(NavigationStateService);

  id = input.required<string>();
  mediaType = input.required<MediaType>();

  item = signal<MediaDetail | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  isTrailerOpen = signal(false);
  isClosing = signal(false);

  hasTrailer = computed<boolean>(() => !!this.item()?.trailerKey);

  private stateKey = '';

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  activeSection = computed<DetailSection>(() => {
    const url = this.url();
    if (url.includes('/cast')) return 'cast';
    if (url.includes('/gallery')) return 'gallery';
    if (url.includes('/reviews')) return 'reviews';
    return null;
  });

  trailerUrl = computed<SafeResourceUrl | null>(() => {
    const key = this.item()?.trailerKey;
    if (!key) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${key}`);
  });

  private readonly basePath = computed<string>(() =>
    this.mediaType() === 'movie' ? '/movies' : '/tv',
  );

  constructor() {
    effect(() => {
      const itemId = this.id();
      const type = this.mediaType();
      if (itemId && type) {
        this.isClosing.set(false);
        this.tryLoad(itemId, type);
      }
    });
  }

  ngOnDestroy(): void {
    const currentItem = this.item();
    if (!currentItem) return;

    this.navState.save<MediaDetailState>(this.stateKey, { item: currentItem }, window.scrollY);
  }

  private tryLoad(id: string, mediaType: MediaType): void {
    this.stateKey = mediaType === 'movie' ? `/movies/${id}` : `/tv/${id}`;

    const cached = this.navState.get<MediaDetailState>(this.stateKey);

    if (cached) {
      this.item.set(cached.data.item);
      this.loading.set(false);
      this.error.set(null);

      requestAnimationFrame(() => {
        window.scrollTo({ top: cached.scrollTop, behavior: 'instant' });
      });
      return;
    }

    this.load(id, mediaType);
  }

  private load(id: string, mediaType: MediaType): void {
    this.loading.set(true);
    this.error.set(null);
    this.mediaService.getDetail(mediaType, id).subscribe({
      next: (data) => {
        this.item.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(`Failed to load ${mediaType === 'movie' ? 'movie' : 'TV show'} details`);
        this.loading.set(false);
      },
    });
  }

  toggleSection(section: Exclude<DetailSection, null>): void {
    const base = this.basePath();
    if (this.activeSection() === section) {
      this.router.navigate([base, this.id()], { replaceUrl: true });
    } else {
      this.router.navigate([base, this.id(), section], { replaceUrl: true });
    }
  }

  openTrailer(): void {
    if (this.trailerUrl()) {
      this.isTrailerOpen.set(true);
    }
  }

  closeTrailer(): void {
    this.isTrailerOpen.set(false);
  }

  closeDetail(): void {
    if (this.isClosing()) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasHistory = window.history.length > 1;

    if (reducedMotion) {
      this.goBack(hasHistory);
      return;
    }

    this.isClosing.set(true);
    setTimeout(() => this.goBack(hasHistory), 700);
  }

  private goBack(hasHistory: boolean): void {
    if (hasHistory) {
      this.location.back();
    } else {
      this.router.navigate([this.basePath()]);
    }
  }
}
