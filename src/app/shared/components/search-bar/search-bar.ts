import {
  Component,
  inject,
  signal,
  ElementRef,
  viewChild,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of, catchError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchService } from '@core/services/search.service';
import { SearchResult } from '@core/models/search.model';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-search-bar',
  imports: [Icon],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar implements OnDestroy {
  private searchService = inject(SearchService);
  private router = inject(Router);

  isOpen = signal(false);
  query = signal('');
  results = signal<SearchResult[]>([]);
  isLoading = signal(false);

  private inputRef = viewChild<ElementRef<HTMLInputElement>>('input');
  private containerRef = viewChild<ElementRef<HTMLDivElement>>('container');

  private readonly search$ = new Subject<string>();

  private readonly movieResults = signal<SearchResult[]>([]);
  private readonly tvResults = signal<SearchResult[]>([]);
  private readonly personResults = signal<SearchResult[]>([]);

  movies = this.movieResults.asReadonly();
  tvs = this.tvResults.asReadonly();
  people = this.personResults.asReadonly();

  hasResults = signal(false);

  constructor() {
    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) => {
          if (q.length < 2) {
            this.resetResults();
            return of(null);
          }
          this.isLoading.set(true);
          return this.searchService.searchMulti(q, 1).pipe(catchError(() => of(null)));
        }),
        takeUntilDestroyed(),
      )
      .subscribe((res) => {
        this.isLoading.set(false);
        if (!res) {
          this.resetResults();
          return;
        }

        const movies: SearchResult[] = [];
        const tvs: SearchResult[] = [];
        const people: SearchResult[] = [];

        for (const r of res.results) {
          if (r.mediaType === 'movie') movies.push(r);
          else if (r.mediaType === 'tv') tvs.push(r);
          else if (r.mediaType === 'person') people.push(r);
        }

        this.movieResults.set(movies.slice(0, 5));
        this.tvResults.set(tvs.slice(0, 5));
        this.personResults.set(people.slice(0, 5));
        this.hasResults.set(movies.length + tvs.length + people.length > 0);
      });
  }

  ngOnDestroy(): void {
    this.search$.complete();
  }

  toggle(): void {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      setTimeout(() => this.inputRef()?.nativeElement.focus());
    } else {
      this.close();
    }
  }

  close(): void {
    this.isOpen.set(false);
    this.query.set('');
    this.resetResults();
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
    this.search$.next(value.trim());
  }

  onEnter(): void {
    const q = this.query().trim();
    if (q.length < 2) return;
    this.close();
    this.router.navigate(['/search'], { queryParams: { q } });
  }

  onResultClick(result: SearchResult): void {
    this.close();
    if (result.mediaType === 'movie') {
      this.router.navigate(['/movies', result.id]);
    } else if (result.mediaType === 'tv') {
      this.router.navigate(['/tv', result.id]);
    } else {
      this.router.navigate(['/people', result.id]);
    }
  }

  onSeeAll(): void {
    const q = this.query().trim();
    if (q.length < 2) return;
    this.close();
    this.router.navigate(['/search'], { queryParams: { q } });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const container = this.containerRef()?.nativeElement;
    if (!container) return;
    if (!container.contains(event.target as Node)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  private resetResults(): void {
    this.movieResults.set([]);
    this.tvResults.set([]);
    this.personResults.set([]);
    this.hasResults.set(false);
  }
}
