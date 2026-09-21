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

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const page = Number(params.get('page')) || 1;
      this.currentPage.set(page);
      this.loadPage(page);
    });
  }

  private loadPage(page: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.movieService.getPopular(page).subscribe({
      next: (response) => {
        this.movies.set(response.results);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load movies');
        this.loading.set(false);
      },
    });
  }

  onPageChange(page: number): void {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }
}
