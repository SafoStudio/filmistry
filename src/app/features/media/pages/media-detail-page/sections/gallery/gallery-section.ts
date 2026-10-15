import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MediaService, MediaType } from '@core/services/media.service';
import { MediaImage } from '@core/models/media-images.model';
import { Icon } from '@shared/components/icon/icon';
import { Loader } from '@shared/components/loader/loader';
import { LightboxService } from './lightbox/lightbox.service';

@Component({
  selector: 'app-gallery-section',
  imports: [Icon, Loader],
  templateUrl: './gallery-section.html',
  styleUrl: './gallery-section.scss',
})
export class GallerySection {
  private mediaService = inject(MediaService);
  private lightbox = inject(LightboxService);

  id = input.required<string>();
  mediaType = input.required<MediaType>();

  images = signal<MediaImage[]>([]);
  loading = signal(true);
  currentSlide = signal(0);

  totalSlides = computed(() => this.images().length);
  counter = computed(() => `${this.currentSlide() + 1} of ${this.totalSlides()}`);

  private lastLoadedId: string | null = null;
  private lastLoadedType: MediaType | null = null;

  constructor() {
    effect(() => {
      const itemId = this.id();
      const type = this.mediaType();
      if (!itemId || !type) return;

      if (this.lastLoadedId === itemId && this.lastLoadedType === type) return;

      this.lastLoadedId = itemId;
      this.lastLoadedType = type;

      this.loading.set(true);
      this.images.set([]);
      this.currentSlide.set(0);

      this.mediaService.getImages(type, itemId).subscribe({
        next: (data) => {
          this.images.set(data.backdrops);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    });
  }

  next(): void {
    const len = this.totalSlides();
    if (len === 0) return;
    this.currentSlide.update((i) => (i === len - 1 ? 0 : i + 1));
  }

  prev(): void {
    const len = this.totalSlides();
    if (len === 0) return;
    this.currentSlide.update((i) => (i === 0 ? len - 1 : i - 1));
  }

  goTo(index: number): void {
    const len = this.totalSlides();
    if (len === 0) return;
    this.currentSlide.set(index);
  }

  openLightbox(): void {
    if (this.totalSlides() === 0) return;
    this.lightbox.open({
      paths: this.images().map((img) => img.path),
      startIndex: this.currentSlide(),
    });
  }
}
