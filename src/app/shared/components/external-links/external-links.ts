import { Component, computed, input } from '@angular/core';
import { ExternalIds } from '@core/models/external-ids.model';
import { Icon, IconName } from '@shared/components/icon/icon';

type ExternalKind = 'movie' | 'tv' | 'person';

interface ExternalLink {
  key: string;
  url: string;
  icon: IconName;
  label: string;
}

@Component({
  selector: 'app-external-links',
  imports: [Icon],
  templateUrl: './external-links.html',
  styleUrl: './external-links.scss',
})
export class ExternalLinks {
  ids = input.required<ExternalIds>();
  kind = input<ExternalKind>('movie');

  links = computed<ExternalLink[]>(() => {
    const ids = this.ids();
    const kind = this.kind();
    const result: ExternalLink[] = [];

    if (ids.imdbId) {
      const imdbPath = kind === 'person' ? 'name' : 'title';
      result.push({
        key: 'imdb',
        url: `https://www.imdb.com/${imdbPath}/${ids.imdbId}`,
        icon: 'imdb',
        label: 'IMDb',
      });
    }

    if (ids.instagramId) {
      result.push({
        key: 'instagram',
        url: `https://www.instagram.com/${ids.instagramId}`,
        icon: 'instagram',
        label: 'Instagram',
      });
    }

    if (ids.twitterId) {
      result.push({
        key: 'twitter',
        url: `https://twitter.com/${ids.twitterId}`,
        icon: 'twitter',
        label: 'Twitter',
      });
    }

    if (ids.facebookId) {
      result.push({
        key: 'facebook',
        url: `https://www.facebook.com/${ids.facebookId}`,
        icon: 'facebook',
        label: 'Facebook',
      });
    }

    if (ids.tiktokId) {
      result.push({
        key: 'tiktok',
        url: `https://www.tiktok.com/@${ids.tiktokId}`,
        icon: 'tiktok',
        label: 'TikTok',
      });
    }

    if (ids.youtubeId) {
      result.push({
        key: 'youtube',
        url: `https://www.youtube.com/${ids.youtubeId}`,
        icon: 'youtube',
        label: 'YouTube',
      });
    }

    if (ids.wikidataId) {
      result.push({
        key: 'wikidata',
        url: `https://www.wikidata.org/wiki/${ids.wikidataId}`,
        icon: 'wikidata',
        label: 'Wikidata',
      });
    }

    return result;
  });
}
