import { Component, inject, input, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MediaService, MediaType } from '@core/services/media.service';
import { CastMember } from '@core/models/media-credits.model';
import { CarouselComponent } from '@shared/components/carousel/carousel';

@Component({
  selector: 'app-cast-section',
  imports: [RouterLink, CarouselComponent],
  templateUrl: './cast-section.html',
  styleUrl: './cast-section.scss',
})
export class CastSection {
  private mediaService = inject(MediaService);

  id = input.required<string>();
  mediaType = input.required<MediaType>();

  cast = signal<CastMember[]>([]);
  loading = signal(true);

  constructor() {
    effect(() => {
      const itemId = this.id();
      const type = this.mediaType();
      if (itemId && type) {
        this.mediaService.getCredits(type, itemId).subscribe({
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
