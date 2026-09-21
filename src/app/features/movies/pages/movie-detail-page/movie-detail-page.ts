import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-detail-page',
  imports: [RouterLink],
  templateUrl: './movie-detail-page.html',
  styleUrl: './movie-detail-page.scss',
})
export class MovieDetailPage {
  id = input.required<string>();
}
