import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SearchService } from '@core/services/search.service';
import { NavigationStateService } from '@core/services/navigation-state.service';
import { SearchResult } from '@core/models/search.model';
import { Pagination } from '@shared/components/pagination/pagination';
import { Loader } from '@shared/components/loader/loader';
import { MediaCard } from '@features/media/components/media-card/media-card';

type SearchTab = 'media' | 'movie' | 'tv' | 'person';

interface SearchPageState {
  query: string;
  tab: SearchTab;
  results: SearchResult[];
  totalPages: number;
  currentPage: number;
}

@Component({
  selector: 'app-search-page',
  imports: [RouterLink, Pagination, Loader, MediaCard],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
})
export class SearchPage implements OnInit, OnDestroy {
  private searchService = inject(SearchService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private navState = inject(NavigationStateService);

  query = signal('');
  tab = signal<SearchTab>('media');
  results = signal<SearchResult[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  currentPage = signal(1);
  totalPages = signal(1);

  private stateKey = '';

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const q = params.get('q')?.trim() ?? '';
      const page = Number(params.get('page')) || 1;
      const tab = (params.get('tab') as SearchTab) || 'media';

      this.query.set(q);
      this.tab.set(tab);
      this.currentPage.set(page);

      this.stateKey = this.buildKey(q, tab, page);

      const cached = this.navState.get<SearchPageState>(this.stateKey);
      if (cached && cached.data.results.length > 0) {
        this.results.set(cached.data.results);
        this.totalPages.set(cached.data.totalPages);
        this.loading.set(false);
        this.error.set(null);

        if (typeof window !== 'undefined') {
          requestAnimationFrame(() => {
            window.scrollTo({ top: cached.scrollTop, behavior: 'instant' });
          });
        }
        return;
      }

      if (q.length < 2) {
        this.results.set([]);
        this.totalPages.set(0);
        this.loading.set(false);
        return;
      }

      this.load(q, tab, page);
    });
  }

  ngOnDestroy(): void {
    if (this.results().length === 0) return;

    const scrollTop = typeof window !== 'undefined' ? window.scrollY : 0;

    this.navState.save<SearchPageState>(
      this.stateKey,
      {
        query: this.query(),
        tab: this.tab(),
        results: this.results(),
        totalPages: this.totalPages(),
        currentPage: this.currentPage(),
      },
      scrollTop,
    );
  }

  private buildKey(q: string, tab: SearchTab, page: number): string {
    const base = `/search?q=${encodeURIComponent(q)}&tab=${tab}`;
    return page > 1 ? `${base}&page=${page}` : base;
  }

  private load(q: string, tab: SearchTab, page: number): void {
    this.loading.set(true);
    this.error.set(null);

    const request$ =
      tab === 'movie'
        ? this.searchService.searchMovie(q, page)
        : tab === 'tv'
          ? this.searchService.searchTv(q, page)
          : tab === 'person'
            ? this.searchService.searchPerson(q, page)
            : this.searchService.searchMulti(q, page);

    request$.subscribe({
      next: (data) => {
        let results = data.results;

        if (tab === 'media') {
          results = results.filter((r) => r.mediaType !== 'person');
        }

        this.results.set(results);
        this.totalPages.set(data.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Search failed');
        this.loading.set(false);
      },
    });
  }

  setTab(tab: SearchTab): void {
    this.router.navigate([], {
      queryParams: { tab, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  onPageChange(page: number): void {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  resultLink(result: SearchResult): string[] {
    if (result.mediaType === 'movie') return ['/movies', String(result.id)];
    if (result.mediaType === 'tv') return ['/tv', String(result.id)];
    return ['/people', String(result.id)];
  }
}
