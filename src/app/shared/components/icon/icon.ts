import { Component, computed, input } from '@angular/core';

export type IconName =
  | 'play'
  | 'users'
  | 'comments'
  | 'images'
  | 'chevron-left'
  | 'chevron-right'
  | 'close'
  | 'star'
  | 'sun'
  | 'moon'
  | 'home'
  | 'film'
  | 'tv'
  | 'search'
  | 'filter'
  | 'anime-eye'
  | 'imdb'
  | 'instagram'
  | 'twitter'
  | 'facebook'
  | 'tiktok'
  | 'youtube'
  | 'wikidata';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  name = input.required<IconName>();
  size = input<number>(20);
  height = input<number | null>(null);
  viewBox = input<string>('0 0 24 24');

  resolvedHeight = computed(() => this.height() ?? this.size());
}
