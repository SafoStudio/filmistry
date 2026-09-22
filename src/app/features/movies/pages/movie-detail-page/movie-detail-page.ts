import { Component, inject, signal, effect, computed, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MovieService } from '../../../../core/services/movie';
import { MovieDetail } from '../../../../core/models/movie-detail.model';
import { RatingBar } from '../../../../shared/components/rating-bar/rating-bar';

@Component({
  selector: 'app-movie-detail-page',
  imports: [RouterLink, RouterOutlet, RatingBar],
  templateUrl: './movie-detail-page.html',
  styleUrl: './movie-detail-page.scss',
})
export class MovieDetailPage {
  private movieService = inject(MovieService);
  private sanitizer = inject(DomSanitizer);

  id = input.required<string>();

  movie = signal<MovieDetail | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  isTrailerOpen = signal(false);

  trailerUrl = computed<SafeResourceUrl | null>(() => {
    const key = this.movie()?.trailerKey;
    if (!key) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${key}`);
  });

  constructor() {
    effect(() => {
      const movieId = this.id();
      if (movieId) this.load(movieId);
    });
  }

  private load(id: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.movieService.getMovieDetail(id).subscribe({
      next: (data) => {
        this.movie.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load movie details');
        this.loading.set(false);
      },
    });
  }

  openTrailer(): void {
    if (this.trailerUrl()) {
      this.isTrailerOpen.set(true);
    }
  }

  closeTrailer(): void {
    this.isTrailerOpen.set(false);
  }
}
