import { Component, inject, input, signal, effect, computed } from '@angular/core';
import { MovieService } from '@core/services/movie';
import { MovieImage } from '@core/models/movie-images.model';
import { Icon } from '@shared/components/icon/icon';
import { Loader } from '@shared/components/loader/loader';

@Component({
  selector: 'app-gallery-section',
  imports: [Icon, Loader],
  templateUrl: './gallery-section.html',
  styleUrl: './gallery-section.scss',
})
export class GallerySection {
  private movieService = inject(MovieService);
  id = input.required<string>();

  images = signal<MovieImage[]>([]);
  loading = signal(true);
  currentSlide = signal(0);

  totalSlides = computed(() => this.images().length);
  counter = computed(() => `${this.currentSlide() + 1} of ${this.totalSlides()}`);

  constructor() {
    effect(() => {
      const movieId = this.id();
      if (movieId) {
        this.movieService.getMovieImages(movieId).subscribe({
          next: (data) => {
            this.images.set(data.backdrops);
            this.loading.set(false);
          },
          error: () => this.loading.set(false),
        });
      }
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
}
