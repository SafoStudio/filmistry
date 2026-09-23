import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../../../core/services/movie';
import { Movie } from '../../../../core/models/movie.model';
import { MovieCard } from '../../components/movie-card/movie-card';
import { Pagination } from '../../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-movies-page',
  imports: [MovieCard, Pagination],
  templateUrl: './movies-page.html',
  styleUrl: './movies-page.scss',
})
export class MoviesPage {
  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  movies = signal<Movie[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  currentPage = signal(1);
  totalPages = signal(1);
  isLeaving = signal(false);

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const page = Number(params.get('page')) || 1;

      if (page === this.currentPage() && this.movies().length > 0) {
        return;
      }

      this.currentPage.set(page);
      this.loadPage(page);
    });
  }

  private loadPage(page: number): void {
    const isFirstLoad = this.movies().length === 0;

    if (isFirstLoad) {
      this.loading.set(true);
      this.error.set(null);
      this.movieService.getPopular(page).subscribe({
        next: (response) => this.applyResponse(response),
        error: () => this.applyError(),
      });
      return;
    }

    this.isLeaving.set(true);

    setTimeout(() => {
      this.movieService.getPopular(page).subscribe({
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

  private applyResponse(response: { results: Movie[]; totalPages: number }): void {
    this.movies.set(response.results);
    this.totalPages.set(response.totalPages);
    this.loading.set(false);
    this.error.set(null);
  }

  private applyError(): void {
    this.error.set('Failed to load movies');
    this.loading.set(false);
  }

  onPageChange(page: number): void {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }
}
