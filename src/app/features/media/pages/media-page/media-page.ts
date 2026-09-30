import { Component, inject, signal, input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaService, MediaType } from '@core/services/media.service';
import { NavigationStateService } from '@core/services/navigation-state.service';
import { Media } from '@core/models/media.model';
import { MediaCard } from '../../components/media-card/media-card';
import { Pagination } from '@shared/components/pagination/pagination';
import { Loader } from '@shared/components/loader/loader';

interface MediaPageState {
  items: Media[];
  totalPages: number;
  currentPage: number;
}

@Component({
  selector: 'app-media-page',
  imports: [MediaCard, Pagination, Loader],
  templateUrl: './media-page.html',
  styleUrl: './media-page.scss',
})
export class MediaPage implements OnInit, OnDestroy {
  private mediaService = inject(MediaService);
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

  private stateKey = '';

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const page = Number(params.get('page')) || 1;
      this.stateKey = this.buildKey(page);

      const cached = this.navState.get<MediaPageState>(this.stateKey);

      if (cached && cached.data.items.length > 0) {
        this.items.set(cached.data.items);
        this.totalPages.set(cached.data.totalPages);
        this.currentPage.set(cached.data.currentPage);
        this.loading.set(false);
        this.error.set(null);

        requestAnimationFrame(() => {
          window.scrollTo({ top: cached.scrollTop, behavior: 'instant' });
        });
        return;
      }

      this.currentPage.set(page);
      this.loadPage(page);
    });
  }

  ngOnDestroy(): void {
    if (this.items().length === 0) return;

    this.navState.save<MediaPageState>(
      this.stateKey,
      {
        items: this.items(),
        totalPages: this.totalPages(),
        currentPage: this.currentPage(),
      },
      window.scrollY,
    );
  }

  private buildKey(page: number): string {
    const base = this.mediaType() === 'movie' ? '/movies' : '/tv';
    return page > 1 ? `${base}?page=${page}` : base;
  }

  private loadPage(page: number): void {
    const isFirstLoad = this.items().length === 0;

    if (isFirstLoad) {
      this.loading.set(true);
      this.error.set(null);
      this.mediaService.getList(this.mediaType(), page).subscribe({
        next: (response) => this.applyResponse(response),
        error: () => this.applyError(),
      });
      return;
    }

    this.isLeaving.set(true);

    setTimeout(() => {
      this.mediaService.getList(this.mediaType(), page).subscribe({
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
}
