import { Component, inject, input, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../../../../../core/services/movie';
import { CastMember } from '../../../../../../core/models/movie-credits.model';

@Component({
  selector: 'app-cast-section',
  imports: [RouterLink],
  templateUrl: './cast-section.html',
  styleUrl: './cast-section.scss',
})
export class CastSection {
  private movieService = inject(MovieService);
  id = input.required<string>();

  cast = signal<CastMember[]>([]);
  loading = signal(true);

  constructor() {
    effect(() => {
      const movieId = this.id();
      if (movieId) {
        this.movieService.getMovieCredits(movieId).subscribe({
          next: (data) => {
            this.cast.set(data.cast);
            this.loading.set(false);
          },
          error: () => this.loading.set(false),
        });
      }
    });
  }
}
