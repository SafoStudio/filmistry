import { Component, inject, input, signal, effect, viewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MediaService, MediaType } from '@core/services/media.service';
import { CastMember } from '@core/models/media-credits.model';
import { Icon } from '@shared/components/icon/icon';
import { Loader } from '@shared/components/loader/loader';

@Component({
  selector: 'app-cast-section',
  imports: [RouterLink, Icon, Loader],
  templateUrl: './cast-section.html',
  styleUrl: './cast-section.scss',
})
export class CastSection {
  private mediaService = inject(MediaService);

  id = input.required<string>();
  mediaType = input.required<MediaType>();

  cast = signal<CastMember[]>([]);
  loading = signal(true);

  slider = viewChild<ElementRef<HTMLDivElement>>('slider');
  canScrollLeft = signal(false);
  canScrollRight = signal(false);

  private readonly CARD_WIDTH = 155;

  constructor() {
    effect(() => {
      const itemId = this.id();
      const type = this.mediaType();
      if (itemId && type) {
        this.mediaService.getCredits(type, itemId).subscribe({
          next: (data) => {
            this.cast.set(data.cast);
            this.loading.set(false);
            setTimeout(() => this.updateArrows());
          },
          error: () => this.loading.set(false),
        });
      }
    });
  }

  scrollLeft(): void {
    const el = this.slider()?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: -this.CARD_WIDTH, behavior: 'smooth' });
    setTimeout(() => this.updateArrows(), 350);
  }

  scrollRight(): void {
    const el = this.slider()?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: this.CARD_WIDTH, behavior: 'smooth' });
    setTimeout(() => this.updateArrows(), 350);
  }

  onScroll(): void {
    this.updateArrows();
  }

  private updateArrows(): void {
    const el = this.slider()?.nativeElement;
    if (!el) return;
    this.canScrollLeft.set(el.scrollLeft > 0);
    this.canScrollRight.set(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }
}
