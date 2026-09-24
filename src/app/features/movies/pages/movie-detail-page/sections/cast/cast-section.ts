import { Component, inject, input, signal, effect, viewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MovieService } from '@core/services/movie';
import { CastMember } from '@core/models/movie-credits.model';
import { Icon } from '@shared/components/icon/icon';
import { Loader } from '@shared/components/loader/loader';

@Component({
  selector: 'app-cast-section',
  imports: [RouterLink, Icon, Loader],
  templateUrl: './cast-section.html',
  styleUrl: './cast-section.scss',
})
export class CastSection {
  private movieService = inject(MovieService);
  id = input.required<string>();

  cast = signal<CastMember[]>([]);
  loading = signal(true);

  slider = viewChild<ElementRef<HTMLDivElement>>('slider');
  canScrollLeft = signal(false);
  canScrollRight = signal(false);

  private readonly CARD_WIDTH = 155; // 145px карточка + 10px gap

  constructor() {
    effect(() => {
      const movieId = this.id();
      if (movieId) {
        this.movieService.getMovieCredits(movieId).subscribe({
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
