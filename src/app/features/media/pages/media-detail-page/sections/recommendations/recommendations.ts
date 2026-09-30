import { Component, input, signal, viewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Media } from '@core/models/media.model';
import { Icon } from '@shared/components/icon/icon';

@Component({
  selector: 'app-recommendations-section',
  imports: [RouterLink, Icon],
  templateUrl: './recommendations.html',
  styleUrl: './recommendations.scss',
})
export class RecommendationsSection implements AfterViewInit {
  items = input.required<Media[]>();
  mediaType = input.required<'movie' | 'tv'>();

  slider = viewChild<ElementRef<HTMLDivElement>>('slider');
  canScrollLeft = signal(false);
  canScrollRight = signal(false);

  private readonly CARD_WIDTH = 162;

  ngAfterViewInit(): void {
    setTimeout(() => this.updateArrows());
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

  detailLink(id: number): string[] {
    return this.mediaType() === 'movie' ? ['/movies', String(id)] : ['/tv', String(id)];
  }
}
