import { Component, inject, input, signal, effect } from '@angular/core';
import { MediaService, MediaType } from '@core/services/media.service';
import { Review } from '@core/models/media-reviews.model';
import { Loader } from '@shared/components/loader/loader';

@Component({
  selector: 'app-reviews-section',
  imports: [Loader],
  templateUrl: './reviews-section.html',
  styleUrl: './reviews-section.scss',
})
export class ReviewsSection {
  private mediaService = inject(MediaService);

  id = input.required<string>();
  mediaType = input.required<MediaType>();

  reviews = signal<Review[]>([]);
  loading = signal(true);

  constructor() {
    effect(() => {
      const itemId = this.id();
      const type = this.mediaType();
      if (itemId && type) {
        this.mediaService.getReviews(type, itemId).subscribe({
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
