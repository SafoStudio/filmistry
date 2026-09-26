import { Component, inject, signal, effect, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MediaService } from '@core/services/media.service';
import { TrendingItem } from '@core/models/trending.model';
import { Loader } from '@shared/components/loader/loader';

@Component({
  selector: 'app-media-randomizer',
  imports: [RouterLink, Loader],
  templateUrl: './media-randomizer.html',
  styleUrl: './media-randomizer.scss',
})
export class MediaRandomizer {
  private mediaService = inject(MediaService);

  trending = signal<TrendingItem[]>([]);
  loading = signal(true);

  randomItem = computed<TrendingItem | null>(() => {
    const items = this.trending();
    if (items.length === 0) return null;
    return items[Math.floor(Math.random() * items.length)];
  });

  detailLink = computed<string>(() => {
    const item = this.randomItem();
    if (!item) return '/';
    return item.mediaType === 'movie' ? `/movies/${item.id}` : `/tv/${item.id}`;
  });

  constructor() {
    effect(() => {
      this.mediaService.getTrending().subscribe({
        next: (data) => {
          this.trending.set(data.results);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    });
  }
}
