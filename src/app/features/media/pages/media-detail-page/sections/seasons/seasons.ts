import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TvSeasonListItem } from '@core/models/tv-season.model';

@Component({
  selector: 'app-seasons-section',
  imports: [RouterLink],
  templateUrl: './seasons.html',
  styleUrl: './seasons.scss',
})
export class SeasonsSection {
  items = input.required<TvSeasonListItem[]>();
  tvId = input.required<string>();
}
