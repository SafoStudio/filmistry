import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Media } from '@core/models/media.model';
import { CarouselComponent } from '@shared/components/carousel/carousel';

@Component({
  selector: 'app-recommendations-section',
  imports: [RouterLink, CarouselComponent],
  templateUrl: './recommendations.html',
  styleUrl: './recommendations.scss',
})
export class RecommendationsSection {
  items = input.required<Media[]>();
  mediaType = input.required<'movie' | 'tv'>();

  detailLink(id: number): string[] {
    return this.mediaType() === 'movie' ? ['/movies', String(id)] : ['/tv', String(id)];
  }
}
