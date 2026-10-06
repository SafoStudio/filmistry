import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Media } from '@core/models/media.model';

@Component({
  selector: 'app-media-card',
  imports: [RouterLink],
  templateUrl: './media-card.html',
  styleUrl: './media-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaCard {
  media = input.required<Media>();
  mediaType = input.required<'movie' | 'tv'>();
}
