import { Component, inject, signal, input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaService, MediaType } from '@core/services/media.service';
import { DiscoverService } from '@core/services/discover.service';
import { NavigationStateService } from '@core/services/navigation-state.service';
import { Media } from '@core/models/media.model';
import { MediaCard } from '../../components/media-card/media-card';
import { Pagination } from '@shared/components/pagination/pagination';
import { Loader } from '@shared/components/loader/loader';
import { FiltersPanel, FiltersValue } from '@shared/components/filters-panel/filters-panel';

interface MediaPageState {
  items: Media[];
  totalPages: number;
  currentPage: number;
}

@Component({
  selector: 'app-media-page',
  imports: [MediaCard, Pagination, Loader, FiltersPanel],
  templateUrl: './media-page.html',
  styleUrl: './media-page.scss',
})
export class MediaPage implements OnInit, OnDestroy {
  private mediaService = inject(MediaService);
  private discoverService = inject(DiscoverService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private navState = inject(NavigationStateService);

  mediaType = input.required<MediaType>();

  items = signal<Media[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  currentPage = signal(1);
  totalPages = signal(1);
  isLeaving = signal(false);

  filterSort = signal('popularity.desc');
  filterGenres = signal('');
  filterYear = signal<number | null>(null);
  filterRating = signal<number | null>(null);

  private stateKey = '';

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const page = Number(params.get('page')) || 1;
      const sort = params.get('sort') ?? 'popularity.desc';
      const genres = params.get('genres') ?? '';
      const yearParam = params.get('year');
      const ratingParam = params.get('rating');

      const year = yearParam ? Number(yearParam) : null;
      const rating = ratingParam ? Number(ratingParam) : null;

      this.filterSort.set(sort);
      this.filterGenres.set(genres);
      this.filterYear.set(year);
      this.filterRating.set(rating);

      this.stateKey = this.buildKey(page);

      const cached = this.navState.get<MediaPageState>(this.stateKey);
      if (cached && cached.data.items.length > 0) {
        this.items.set(cached.data.items);
        this.totalPages.set(cached.data.totalPages);
        this.currentPage.set(cached.data.currentPage);
        this.loading.set(false);
        this.error.set(null);

        if (typeof window !== 'undefined') {
          requestAnimationFrame(() => {
            window.scrollTo({ top: cached.scrollTop, behavior: 'instant' });
          });
        }
        return;
      }

      this.currentPage.set(page);
      this.loadPage(page);
    });
  }

  ngOnDestroy(): void {
    if (this.items().length === 0) return;

    const scrollTop = typeof window !== 'undefined' ? window.scrollY : 0;

    this.navState.save<MediaPageState>(
      this.stateKey,
      {
        items: this.items(),
        totalPages: this.totalPages(),
        currentPage: this.currentPage(),
      },
      scrollTop,
    );
  }

  private buildKey(page: number): string {
    const base = this.mediaType() === 'movie' ? '/movies' : '/tv';
    const parts: string[] = [];

    if (page > 1) parts.push(`page=${page}`);
    if (this.filterSort() !== 'popularity.desc') parts.push(`sort=${this.filterSort()}`);
    if (this.filterGenres()) parts.push(`genres=${this.filterGenres()}`);
    if (this.filterYear() !== null) parts.push(`year=${this.filterYear()}`);
    if (this.filterRating() !== null) parts.push(`rating=${this.filterRating()}`);

    return parts.length > 0 ? `${base}?${parts.join('&')}` : base;
  }

  private hasActiveFilters(): boolean {
    return (
      this.filterSort() !== 'popularity.desc' ||
      !!this.filterGenres() ||
      this.filterYear() !== null ||
      this.filterRating() !== null
    );
  }

  private loadPage(page: number): void {
    const isFirstLoad = this.items().length === 0;

    const request$ = this.hasActiveFilters()
      ? this.mediaType() === 'movie'
        ? this.discoverService.discoverMovies({
            page,
            sort: this.filterSort() as any,
            genres: this.filterGenres(),
            year: this.filterYear() ?? undefined,
            rating: this.filterRating() ?? undefined,
          })
        : this.discoverService.discoverTv({
            page,
            sort: this.filterSort() as any,
            genres: this.filterGenres(),
            year: this.filterYear() ?? undefined,
            rating: this.filterRating() ?? undefined,
          })
      : this.mediaService.getList(this.mediaType(), page);

    if (isFirstLoad) {
      this.loading.set(true);
      this.error.set(null);
      request$.subscribe({
        next: (response) => this.applyResponse(response),
        error: () => this.applyError(),
      });
      return;
    }

    this.isLeaving.set(true);

    setTimeout(() => {
      request$.subscribe({
        next: (response) => {
          this.applyResponse(response);
          requestAnimationFrame(() => this.isLeaving.set(false));
        },
        error: () => {
          this.isLeaving.set(false);
          this.applyError();
        },
      });
    }, 260);
  }

  private applyResponse(response: { results: Media[]; totalPages: number }): void {
    this.items.set(response.results);
    this.totalPages.set(response.totalPages);
    this.loading.set(false);
    this.error.set(null);
  }

  private applyError(): void {
    this.error.set(`Failed to load ${this.mediaType() === 'movie' ? 'movies' : 'TV shows'}`);
    this.loading.set(false);
  }

  onPageChange(page: number): void {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  onFiltersApply(value: FiltersValue): void {
    this.router.navigate([], {
      queryParams: {
        sort: value.sort !== 'popularity.desc' ? value.sort : null,
        genres: value.genres || null,
        year: value.year,
        rating: value.rating,
        page: 1,
      },
      queryParamsHandling: 'merge',
    });
  }

  onFiltersReset(): void {
    this.router.navigate([], {
      queryParams: {
        sort: null,
        genres: null,
        year: null,
        rating: null,
        page: 1,
      },
      queryParamsHandling: 'merge',
    });
  }
}
