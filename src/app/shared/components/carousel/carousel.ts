import {
  Component,
  input,
  signal,
  viewChild,
  contentChild,
  effect,
  computed,
  TemplateRef,
  ElementRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-carousel',
  imports: [NgTemplateOutlet, Icon],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class CarouselComponent {
  items = input.required<unknown[]>();
  loading = input<boolean>(false);
  cardWidth = input<number>(160);
  emptyMessage = input<string>('No items');

  slideTemplate = contentChild.required<TemplateRef<unknown>>('slide');

  slider = viewChild<ElementRef<HTMLDivElement>>('slider');
  canScrollLeft = signal(false);
  canScrollRight = signal(false);
  isOverflowing = signal(false);

  hasNav = computed(() => this.isOverflowing() && this.items().length > 1);

  constructor() {
    effect(() => {
      const items = this.items();
      if (items.length === 0) return;

      if (typeof window === 'undefined') return;

      queueMicrotask(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => this.updateArrows());
        });
      });
    });
  }

  scrollLeft(): void {
    const el = this.slider()?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: -this.cardWidth(), behavior: 'smooth' });
    setTimeout(() => this.updateArrows(), 350);
  }

  scrollRight(): void {
    const el = this.slider()?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: this.cardWidth(), behavior: 'smooth' });
    setTimeout(() => this.updateArrows(), 350);
  }

  onScroll(): void {
    this.updateArrows();
  }

  private updateArrows(): void {
    const el = this.slider()?.nativeElement;
    if (!el) return;

    const overflowing = el.scrollWidth > el.clientWidth + 1;
    this.isOverflowing.set(overflowing);

    this.canScrollLeft.set(el.scrollLeft > 0);
    this.canScrollRight.set(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }
}
