import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../../core/models/movie.model';

@Component({
  selector: 'app-movie-card',
  imports: [RouterLink],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
})
export class MovieCard {
  movie = input.required<Movie>();
}
