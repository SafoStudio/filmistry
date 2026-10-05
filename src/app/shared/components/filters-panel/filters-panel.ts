import {
  Component,
  inject,
  input,
  output,
  signal,
  effect,
  untracked,
  viewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  afterNextRender,
} from '@angular/core';
import { GenreService } from '@core/services/genre.service';
import { Genre } from '@core/models/genre.model';
import { Icon } from '../icon/icon';

export interface FiltersValue {
  sort: string;
  genres: string;
  year: number | null;
  rating: number | null;
}

export type FiltersMediaType = 'movie' | 'tv';

@Component({
  selector: 'app-filters-panel',
  imports: [Icon],
  templateUrl: './filters-panel.html',
  styleUrl: './filters-panel.scss',
})
export class FiltersPanel implements OnInit, OnDestroy {
  private genreService = inject(GenreService);

  title = input<string>('All');
  filtersOpen = input<boolean>(true);
  mediaType = input.required<FiltersMediaType>();
  initialSort = input<string>('popularity.desc');
  initialGenres = input<string>('');
  initialYear = input<number | null>(null);
  initialRating = input<number | null>(null);

  toggle = output<void>();
  apply = output<FiltersValue>();
  reset = output<void>();
  close = output<void>();

  genres = signal<Genre[]>([]);
  genresLoading = signal(true);

  selectedSort = signal('popularity.desc');
  selectedGenres = signal<Set<number>>(new Set());
  selectedYear = signal<number | null>(null);
  selectedRating = signal<number | null>(null);

  titleOffset = signal(0);
  toggleOffset = signal(0);

  private barRef = viewChild<ElementRef<HTMLDivElement>>('bar');
  private titleRef = viewChild<ElementRef<HTMLDivElement>>('titleEl');
  private toggleRef = viewChild<ElementRef<HTMLButtonElement>>('toggle');

  private resizeObserver: ResizeObserver | null = null;

  readonly sortOptions = [
    { value: 'popularity.desc', label: 'Popularity ↓' },
    { value: 'popularity.asc', label: 'Popularity ↑' },
    { value: 'vote_average.desc', label: 'Rating ↓' },
    { value: 'vote_average.asc', label: 'Rating ↑' },
    { value: 'primary_release_date.desc', label: 'Newest first' },
    { value: 'primary_release_date.asc', label: 'Oldest first' },
  ];

  readonly tvSortOptions = [
    { value: 'popularity.desc', label: 'Popularity ↓' },
    { value: 'popularity.asc', label: 'Popularity ↑' },
    { value: 'vote_average.desc', label: 'Rating ↓' },
    { value: 'vote_average.asc', label: 'Rating ↑' },
    { value: 'first_air_date.desc', label: 'Newest first' },
    { value: 'first_air_date.asc', label: 'Oldest first' },
  ];

  readonly ratingOptions = [
    { value: 5, label: '5+' },
    { value: 6, label: '6+' },
    { value: 7, label: '7+' },
    { value: 8, label: '8+' },
    { value: 9, label: '9+' },
  ];

  readonly years = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i);

  constructor() {
    effect(() => {
      const sort = this.initialSort();
      const genreStr = this.initialGenres();
      const year = this.initialYear();
      const rating = this.initialRating();

      untracked(() => {
        this.selectedSort.set(sort);

        if (genreStr) {
          const ids = genreStr
            .split(',')
            .map((s) => Number(s.trim()))
            .filter((n) => Number.isFinite(n));
          this.selectedGenres.set(new Set(ids));
        } else {
          this.selectedGenres.set(new Set());
        }

        this.selectedYear.set(year);
        this.selectedRating.set(rating);
      });
    });

    effect(() => {
      const isOpen = this.filtersOpen();
      void isOpen;

      if (typeof window === 'undefined') return;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => this.recalcOffsets());
      });
    });

    afterNextRender(() => {
      this.setupResizeObserver();
      this.recalcOffsets();
    });
  }

  ngOnInit(): void {
    const request =
      this.mediaType() === 'movie'
        ? this.genreService.getMovieGenres()
        : this.genreService.getTvGenres();

    request.subscribe({
      next: (data) => {
        this.genres.set(data.genres);
        this.genresLoading.set(false);
      },
      error: () => this.genresLoading.set(false),
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  get sortList() {
    return this.mediaType() === 'movie' ? this.sortOptions : this.tvSortOptions;
  }

  get hasActiveFilters(): boolean {
    return (
      this.selectedGenres().size > 0 ||
      this.selectedYear() !== null ||
      this.selectedRating() !== null ||
      this.selectedSort() !== 'popularity.desc'
    );
  }

  onToggle(): void {
    this.toggle.emit();
  }

  toggleGenre(id: number): void {
    const current = new Set(this.selectedGenres());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedGenres.set(current);
  }

  isGenreSelected(id: number): boolean {
    return this.selectedGenres().has(id);
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedSort.set(value);
  }

  onYearChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedYear.set(value ? Number(value) : null);
  }

  onRatingChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedRating.set(value ? Number(value) : null);
  }

  onApply(): void {
    const genreStr = Array.from(this.selectedGenres())
      .sort((a, b) => a - b)
      .join(',');

    this.apply.emit({
      sort: this.selectedSort(),
      genres: genreStr,
      year: this.selectedYear(),
      rating: this.selectedRating(),
    });

    this.close.emit();
  }

  onReset(): void {
    this.selectedSort.set('popularity.desc');
    this.selectedGenres.set(new Set());
    this.selectedYear.set(null);
    this.selectedRating.set(null);
    this.reset.emit();
    this.close.emit();
  }

  private setupResizeObserver(): void {
    if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.recalcOffsets();
    });

    const bar = this.barRef()?.nativeElement;
    if (bar) {
      this.resizeObserver.observe(bar);
    }
  }

  private recalcOffsets(): void {
    if (typeof window === 'undefined') return;

    const bar = this.barRef()?.nativeElement;
    const title = this.titleRef()?.nativeElement;
    const toggle = this.toggleRef()?.nativeElement;

    if (!bar || !title || !toggle) return;

    if (this.filtersOpen()) {
      this.titleOffset.set(0);
      this.toggleOffset.set(0);
      return;
    }

    const barRect = bar.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();
    const toggleRect = toggle.getBoundingClientRect();

    const titleLeft = titleRect.left - barRect.left;
    const toggleLeft = toggleRect.left - barRect.left;

    const gap = 16;
    const totalWidth = titleRect.width + toggleRect.width + gap;

    const targetLeft = (barRect.width - totalWidth) / 2;

    const titleShift = targetLeft - titleLeft;
    const toggleTargetLeft = targetLeft + titleRect.width + gap;
    const toggleShift = toggleTargetLeft - toggleLeft;

    this.titleOffset.set(titleShift);
    this.toggleOffset.set(toggleShift);
  }
}
