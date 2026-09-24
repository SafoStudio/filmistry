import { Component, inject, signal, effect, computed, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { MovieService } from '@core/services/movie';
import { MovieDetail } from '@core/models/movie-detail.model';
import { RatingBar } from '@shared/components/rating-bar/rating-bar';
import { Icon } from '@shared/components/icon/icon';
import { Loader } from '@shared/components/loader/loader';

type DetailSection = 'cast' | 'gallery' | 'reviews' | null;

@Component({
  selector: 'app-movie-detail-page',
  imports: [RouterOutlet, RatingBar, Icon, Loader],
  templateUrl: './movie-detail-page.html',
  styleUrl: './movie-detail-page.scss',
})
export class MovieDetailPage {
  private movieService = inject(MovieService);
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);

  id = input.required<string>();

  movie = signal<MovieDetail | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  isTrailerOpen = signal(false);
  isClosing = signal(false);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  activeSection = computed<DetailSection>(() => {
    const url = this.url();
    if (url.includes('/cast')) return 'cast';
    if (url.includes('/gallery')) return 'gallery';
    if (url.includes('/reviews')) return 'reviews';
    return null;
  });

  trailerUrl = computed<SafeResourceUrl | null>(() => {
    const key = this.movie()?.trailerKey;
    if (!key) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${key}`);
  });

  constructor() {
    effect(() => {
      const movieId = this.id();
      if (movieId) this.load(movieId);
    });
  }

  private load(id: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.movieService.getMovieDetail(id).subscribe({
      next: (data) => {
        this.movie.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load movie details');
        this.loading.set(false);
      },
    });
  }

  toggleSection(section: Exclude<DetailSection, null>): void {
    if (this.activeSection() === section) {
      this.router.navigate(['/movies', this.id()]);
    } else {
      this.router.navigate(['/movies', this.id(), section]);
    }
  }

  openTrailer(): void {
    if (this.trailerUrl()) {
      this.isTrailerOpen.set(true);
    }
  }

  closeTrailer(): void {
    this.isTrailerOpen.set(false);
  }

  closeDetail(): void {
    if (this.isClosing()) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      this.router.navigate(['/movies']);
      return;
    }

    this.isClosing.set(true);
    setTimeout(() => {
      this.router.navigate(['/movies']);
    }, 700);
  }
}
