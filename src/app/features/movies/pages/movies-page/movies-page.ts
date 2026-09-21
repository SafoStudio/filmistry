import { Component, inject, signal } from '@angular/core';
import { MovieService } from '../../../../core/services/movie';
import { Movie } from '../../../../core/models/movie.model';
import { MovieCard } from '../../components/movie-card/movie-card';

@Component({
  selector: 'app-movies-page',
  imports: [MovieCard],
  templateUrl: './movies-page.html',
  styleUrl: './movies-page.scss',
})
export class MoviesPage {
  private movieService = inject(MovieService);

  movies = signal<Movie[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.movieService.getPopular().subscribe({
      next: (response) => {
        this.movies.set(response.results);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load movies');
        this.loading.set(false);
      },
    });
  }
}
