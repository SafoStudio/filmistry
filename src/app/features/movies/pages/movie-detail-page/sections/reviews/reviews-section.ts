import { Component, inject, input, signal, effect } from '@angular/core';
import { MovieService } from '../../../../../../core/services/movie';
import { Review } from '../../../../../../core/models/movie-reviews.model';
import { Loader } from '../../../../../../shared/components/loader/loader';

@Component({
  selector: 'app-reviews-section',
  imports: [Loader],
  templateUrl: './reviews-section.html',
  styleUrl: './reviews-section.scss',
})
export class ReviewsSection {
  private movieService = inject(MovieService);
  id = input.required<string>();

  reviews = signal<Review[]>([]);
  loading = signal(true);

  constructor() {
    effect(() => {
      const movieId = this.id();
      if (movieId) {
        this.movieService.getMovieReviews(movieId).subscribe({
          next: (data) => {
            this.reviews.set(data.reviews);
            this.loading.set(false);
          },
          error: () => this.loading.set(false),
        });
      }
    });
  }
}
