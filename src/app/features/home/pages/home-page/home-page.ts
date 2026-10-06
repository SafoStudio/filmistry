import { Component, signal, computed } from '@angular/core';
import { MediaRandomizer } from '../../components/media-randomizer/media-randomizer';
import { MovieTrailerBar } from '../../components/movie-trailer-bar/movie-trailer-bar';
import { Loader } from '@shared/components/loader/loader';

@Component({
  selector: 'app-home-page',
  imports: [MediaRandomizer, MovieTrailerBar, Loader],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  loadedCount = signal(0);

  isAllLoaded = computed(() => this.loadedCount() >= 2);

  onChildLoaded(): void {
    this.loadedCount.update((c) => c + 1);
  }
}
