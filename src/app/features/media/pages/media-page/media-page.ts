import { Component, inject, signal, input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaService, MediaType } from '@core/services/media.service';
import { Media } from '@core/models/media.model';
import { MediaCard } from '../../components/media-card/media-card';
import { Pagination } from '@shared/components/pagination/pagination';
import { Loader } from '@shared/components/loader/loader';

@Component({
  selector: 'app-media-page',
  imports: [MediaCard, Pagination, Loader],
  templateUrl: './media-page.html',
  styleUrl: './media-page.scss',
})
export class MediaPage implements OnInit {
  private mediaService = inject(MediaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  mediaType = input.required<MediaType>();

  items = signal<Media[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  currentPage = signal(1);
  totalPages = signal(1);
  isLeaving = signal(false);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const page = Number(params.get('page')) || 1;

      if (page === this.currentPage() && this.items().length > 0) {
        return;
      }

      this.currentPage.set(page);
      this.loadPage(page);
    });
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
