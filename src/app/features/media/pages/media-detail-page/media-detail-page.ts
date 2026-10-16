import {
  Component,
  inject,
  signal,
  effect,
  computed,
  input,
  viewChild,
  ElementRef,
  afterRenderEffect,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterOutlet, Router, NavigationEnd, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { MediaService, MediaType } from '@core/services/media.service';
import { NavigationStateService } from '@core/services/navigation-state.service';
import { MediaDetail } from '@core/models/media-detail.model';
import { RatingBar } from '@features/media/components/rating-bar/rating-bar';
import { Icon } from '@shared/components/icon/icon';
import { Loader } from '@shared/components/loader/loader';
import { PageCurl } from '@shared/components/page-curl/page-curl';
import { RecommendationsSection } from './sections/recommendations/recommendations';
import { SeasonsSection } from '@features/media/pages/media-detail-page/sections/seasons/seasons';
import { ExternalLinks } from '@shared/components/external-links/external-links';
import { ExternalIds } from '@core/models/external-ids.model';

type DetailSection = 'cast' | 'gallery' | 'reviews' | null;

interface MediaDetailState {
  item: MediaDetail;
  externalIds: ExternalIds | null;
}

@Component({
  selector: 'app-media-detail-page',
  imports: [
    RouterOutlet,
    RatingBar,
    Icon,
    Loader,
    PageCurl,
    RecommendationsSection,
    RouterLink,
    SeasonsSection,
    ExternalLinks,
  ],
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
  externalIds = signal<ExternalIds | null>(null);

  isOverviewExpanded = signal(false);
  isOverviewOverflowing = signal(false);

  overviewRef = viewChild<ElementRef<HTMLParagraphElement>>('overview');
  posterColRef = viewChild<ElementRef<HTMLDivElement>>('posterCol');
  infoHeaderRef = viewChild<ElementRef<HTMLDivElement>>('infoHeader');
  cardRef = viewChild<ElementRef<HTMLDivElement>>('cardRef');

  private resizeObserver: ResizeObserver | null = null;

  hasTrailer = computed<boolean>(() => !!this.item()?.trailerKey);

  private stateKey = '';
  private lastLoadedId: string | null = null;
  private lastLoadedType: MediaType | null = null;

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
      if (!itemId || !type) return;

      if (this.lastLoadedId === itemId && this.lastLoadedType === type) return;

      this.lastLoadedId = itemId;
      this.lastLoadedType = type;

      this.isClosing.set(false);
      this.isOverviewExpanded.set(false);
      this.tryLoad(itemId, type);
    });

    effect(() => {
      document.body.style.overflow = this.isTrailerOpen() ? 'hidden' : '';
    });

    afterRenderEffect(() => {
      const overview = this.overviewRef();
      if (overview) {
        this.checkOverviewOverflow();
      }
    });

    afterRenderEffect(() => {
      this.setupResizeObserver();
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    document.body.style.overflow = '';
    const currentItem = this.item();
    if (!currentItem) return;

    this.navState.save<MediaDetailState>(this.stateKey, {
      item: currentItem,
      externalIds: this.externalIds(),
    });
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.isTrailerOpen()) {
      this.closeTrailer();
    }
  }

  private tryLoad(id: string, mediaType: MediaType): void {
    this.stateKey = mediaType === 'movie' ? `/movies/${id}` : `/tv/${id}`;

    const cached = this.navState.get<MediaDetailState>(this.stateKey);

    if (cached) {
      this.item.set(cached.data.item);
      this.externalIds.set(cached.data.externalIds ?? null);
      this.loading.set(false);
      this.error.set(null);
      return;
    }

    this.load(id, mediaType);
  }

  private load(id: string, mediaType: MediaType): void {
    this.loading.set(true);
    this.error.set(null);
    this.externalIds.set(null);
    this.isTrailerOpen.set(false);

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

    this.mediaService.getExternalIds(mediaType, id).subscribe({
      next: (ids) => this.externalIds.set(ids),
      error: () => this.externalIds.set(null),
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

  private setupResizeObserver(): void {
    if (typeof ResizeObserver === 'undefined') return;

    const card = this.cardRef()?.nativeElement;
    if (!card) return;

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.checkOverviewOverflow();
    });
    this.resizeObserver.observe(card);
  }

  checkOverviewOverflow(): void {
    const overview = this.overviewRef()?.nativeElement;
    if (!overview) return;

    if (this.isOverviewExpanded()) {
      overview.style.maxHeight = `${overview.scrollHeight}px`;
      this.isOverviewOverflowing.set(true);
      return;
    }

    overview.style.maxHeight = 'none';
    const overviewHeight = overview.scrollHeight;

    const posterCol = this.posterColRef()?.nativeElement;
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

    let targetHeight = 140;

    if (isDesktop && posterCol && posterCol.offsetHeight > 100) {
      const infoHeader = this.infoHeaderRef()?.nativeElement;
      const headerHeight = infoHeader ? infoHeader.offsetHeight : 140;
      targetHeight = Math.max(150, Math.min(260, posterCol.offsetHeight - headerHeight - 60));
    }

    if (overviewHeight > targetHeight + 15) {
      overview.style.maxHeight = `${targetHeight}px`;
      this.isOverviewOverflowing.set(true);
    } else {
      overview.style.maxHeight = 'none';
      this.isOverviewOverflowing.set(false);
    }
  }

  toggleOverview(): void {
    this.isOverviewExpanded.update((v) => !v);
  }

  private goBack(hasHistory: boolean): void {
    if (hasHistory) {
      this.location.back();
    } else {
      this.router.navigate([this.basePath()]);
    }
  }
}
