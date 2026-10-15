import {
  Component,
  inject,
  signal,
  computed,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { LightboxService } from './lightbox.service';
import { LIGHTBOX_DATA, LightboxData } from './lightbox.tokens';
import { Icon } from '@shared/components/icon/icon';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const LIGHTBOX_SIZE = 'w1280';

@Component({
  selector: 'app-lightbox',
  imports: [Icon],
  templateUrl: './lightbox.html',
  styleUrl: './lightbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Lightbox {
  private lightboxService = inject(LightboxService);
  private data = inject<LightboxData>(LIGHTBOX_DATA);

  paths = signal<string[]>(this.data.paths);
  currentIndex = signal(this.data.startIndex);

  totalSlides = computed(() => this.paths().length);
  counter = computed(() => `${this.currentIndex() + 1} of ${this.totalSlides()}`);
  currentUrl = computed(
    () => `${TMDB_IMAGE_BASE_URL}/${LIGHTBOX_SIZE}${this.paths()[this.currentIndex()]}`,
  );

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  @HostListener('document:keydown.arrowleft')
  onPrev(): void {
    this.prev();
  }

  @HostListener('document:keydown.arrowright')
  onNext(): void {
    this.next();
  }

  next(): void {
    const len = this.totalSlides();
    if (len === 0) return;
    this.currentIndex.update((i) => (i === len - 1 ? 0 : i + 1));
  }

  prev(): void {
    const len = this.totalSlides();
    if (len === 0) return;
    this.currentIndex.update((i) => (i === 0 ? len - 1 : i - 1));
  }

  close(): void {
    this.lightboxService.close();
  }
}
