import { Component, inject, signal, input, computed, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaService, MediaType } from '@core/services/media.service';
import { DiscoverService } from '@core/services/discover.service';
import { NavigationStateService } from '@core/services/navigation-state.service';
import { Media } from '@core/models/media.model';
import { MOVIE_GENRES, TV_GENRES, COUNTRIES } from '@core/constants/genres';
import { MediaCard } from '../../components/media-card/media-card';
import { Pagination } from '@shared/components/pagination/pagination';
import { LoadMoreButton } from '@shared/components/load-more-button/load-more-button';
import { Loader } from '@shared/components/loader/loader';
import { FiltersPanel, FiltersValue } from '@shared/components/filters-panel/filters-panel';

interface MediaPageState {
  items: Media[];
  totalPages: number;
  currentPage: number;
}

type Preset = 'anime' | 'cartoons' | null;

@Component({
  selector: 'app-media-page',
  imports: [MediaCard, Pagination, LoadMoreButton, Loader, FiltersPanel],
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

  preset = signal<Preset>(null);
  activeMediaType = signal<MediaType>('movie');

  items = signal<Media[]>([]);
  loading = signal(true);
  loadingMore = signal(false);
  error = signal<string | null>(null);
  currentPage = signal(1);
  totalPages = signal(1);
  isLeaving = signal(false);
  filtersOpen = signal(true);
  filterSort = signal('popularity.desc');
  filterGenres = signal('');
  filterCountry = signal('');
  filterLanguage = signal('');
  filterYear = signal<number | null>(null);
  filterRating = signal<number | null>(null);

  presetGenres = signal('');
  presetLanguage = signal('');

  filterTitle = computed<string>(() => {
    const p = this.preset();
    const activeType = this.activeMediaType();

    if (p === 'anime') {
      return activeType === 'tv' ? 'Anime TV' : 'Anime Movies';
    }
    if (p === 'cartoons') {
      return activeType === 'tv' ? 'Cartoon TV' : 'Cartoon Movies';
    }

    const isMovie = activeType === 'movie';
    const baseWord = isMovie ? 'movies' : 'TV shows';
    const genreMap = isMovie ? MOVIE_GENRES : TV_GENRES;

    const genres = this.filterGenres();
    const year = this.filterYear();
    const country = this.filterCountry();

    const parts: string[] = [];

    if (genres) {
      const ids = genres
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isFinite(n));
      const names = ids.map((id) => genreMap[id]).filter(Boolean);
      if (names.length > 0) parts.push(names.join(', '));
    }

    if (country) {
      const countryName = COUNTRIES[country];
      if (countryName) parts.push(countryName);
    }

    if (year) {
      parts.push(String(year));
    }

    if (parts.length === 0) {
      return `All ${baseWord}`;
    }

    return `${parts.join(' ')} ${baseWord}`;
  });

  hasUserActiveFilters = computed<boolean>(
    () =>
      this.filterSort() !== 'popularity.desc' ||
      !!this.filterGenres() ||
      !!this.filterCountry() ||
      !!this.filterLanguage() ||
      this.filterYear() !== null ||
      this.filterRating() !== null,
  );

  private needsDiscover = computed<boolean>(() => !!this.preset() || this.hasUserActiveFilters());

  canLoadMore = computed<boolean>(() => this.currentPage() < this.totalPages());

  isEmpty = computed<boolean>(() => !this.loading() && !this.error() && this.items().length === 0);

  private stateKey = '';

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      const presetFromData = (data['preset'] as Preset) ?? null;
      this.preset.set(presetFromData);
    });

    this.route.queryParamMap.subscribe((params) => {
      const page = Number(params.get('page')) || 1;
      const sort = params.get('sort') ?? 'popularity.desc';
      const genres = params.get('genres') ?? '';
      const country = params.get('country') ?? '';
      const language = params.get('language') ?? '';
      const yearParam = params.get('year');
      const ratingParam = params.get('rating');

      const year = yearParam ? Number(yearParam) : null;
      const rating = ratingParam ? Number(ratingParam) : null;

      const p = this.preset();

      let activeType = this.mediaType();

      if (p === 'anime') {
        this.presetGenres.set('16');
        this.presetLanguage.set('ja');
      } else if (p === 'cartoons') {
        this.presetGenres.set('16');
        this.presetLanguage.set('');
      } else {
        this.presetGenres.set('');
        this.presetLanguage.set('');
      }

      this.filterSort.set(sort);
      this.filterGenres.set(genres);
      this.filterCountry.set(p ? '' : country);
      this.filterLanguage.set(language);
      this.filterYear.set(year);
      this.filterRating.set(rating);

      if (p) {
        const typeParam = params.get('type') as MediaType | null;
        activeType = typeParam === 'tv' ? 'tv' : typeParam === 'movie' ? 'movie' : 'movie';
      }

      this.activeMediaType.set(activeType);

      this.stateKey = this.buildKey(activeType, page);

      const cached = this.navState.get<MediaPageState>(this.stateKey);
      if (cached && cached.data.items.length > 0) {
        this.items.set(cached.data.items);
        this.totalPages.set(cached.data.totalPages);
        this.currentPage.set(cached.data.currentPage);
        this.loading.set(false);
        this.error.set(null);
        return;
      }

      this.currentPage.set(page);
      this.loadPage(page, false);
    });
  }

  ngOnDestroy(): void {
    if (this.items().length === 0) return;

    this.navState.save<MediaPageState>(this.stateKey, {
      items: this.items(),
      totalPages: this.totalPages(),
      currentPage: this.currentPage(),
    });
  }

  private buildKey(activeType: MediaType, page: number): string {
    const p = this.preset();

    if (p) {
      const base = `/${p}`;
      const parts: string[] = [];
      if (page > 1) parts.push(`page=${page}`);
      parts.push(`type=${activeType}`);
      if (this.filterSort() !== 'popularity.desc') parts.push(`sort=${this.filterSort()}`);
      if (this.filterGenres()) parts.push(`genres=${this.filterGenres()}`);
      if (this.filterYear() !== null) parts.push(`year=${this.filterYear()}`);
      if (this.filterRating() !== null) parts.push(`rating=${this.filterRating()}`);
      return `${base}?${parts.join('&')}`;
    }

    const base = activeType === 'movie' ? '/movies' : '/tv';
    const parts: string[] = [];

    if (page > 1) parts.push(`page=${page}`);
    if (this.filterSort() !== 'popularity.desc') parts.push(`sort=${this.filterSort()}`);
    if (this.filterGenres()) parts.push(`genres=${this.filterGenres()}`);
    if (this.filterCountry()) parts.push(`country=${this.filterCountry()}`);
    if (this.filterYear() !== null) parts.push(`year=${this.filterYear()}`);
    if (this.filterRating() !== null) parts.push(`rating=${this.filterRating()}`);

    return parts.length > 0 ? `${base}?${parts.join('&')}` : base;
  }

  private buildGenresParam(): string {
    const user = this.filterGenres();
    const preset = this.presetGenres();

    if (!preset) return user;
    if (!user) return preset;
    return `${preset},${user}`;
  }

  private loadPage(page: number, append: boolean): void {
    const activeType = this.activeMediaType();

    const request$ = this.needsDiscover()
      ? activeType === 'movie'
        ? this.discoverService.discoverMovies({
            page,
            sort: this.filterSort() as any,
            genres: this.buildGenresParam(),
            year: this.filterYear() ?? undefined,
            rating: this.filterRating() ?? undefined,
            country: this.preset() ? undefined : this.filterCountry() || undefined,
            language: this.presetLanguage() || this.filterLanguage() || undefined,
          })
        : this.discoverService.discoverTv({
            page,
            sort: this.filterSort() as any,
            genres: this.buildGenresParam(),
            year: this.filterYear() ?? undefined,
            rating: this.filterRating() ?? undefined,
            country: this.preset() ? undefined : this.filterCountry() || undefined,
            language: this.presetLanguage() || this.filterLanguage() || undefined,
          })
      : this.mediaService.getList(activeType, page);

    if (!append) {
      this.loading.set(true);
      this.error.set(null);
      request$.subscribe({
        next: (response) => this.applyResponse(response, false),
        error: () => this.applyError(),
      });
      return;
    }

    this.loadingMore.set(true);

    request$.subscribe({
      next: (response) => {
        this.applyResponse(response, true);
        this.loadingMore.set(false);
      },
      error: () => {
        this.loadingMore.set(false);
        this.applyError();
      },
    });
  }

  private applyResponse(response: { results: Media[]; totalPages: number }, append: boolean): void {
    if (append) {
      this.items.update((current) => {
        const existingIds = new Set(current.map((i) => i.id));
        const newItems = response.results.filter((i) => !existingIds.has(i.id));
        return [...current, ...newItems];
      });
    } else {
      this.items.set(response.results);
    }

    this.totalPages.set(response.totalPages);
    this.loading.set(false);
    this.error.set(null);
  }

  private applyError(): void {
    this.error.set(`Failed to load ${this.activeMediaType() === 'movie' ? 'movies' : 'TV shows'}`);
    this.loading.set(false);
    this.loadingMore.set(false);
  }

  toggleFilters(): void {
    this.filtersOpen.update((v) => !v);
  }

  closeFilters(): void {
    this.filtersOpen.set(false);
  }

  loadMore(): void {
    if (this.loadingMore() || !this.canLoadMore()) return;
    const nextPage = this.currentPage() + 1;
    this.currentPage.set(nextPage);
    this.loadPage(nextPage, true);
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
