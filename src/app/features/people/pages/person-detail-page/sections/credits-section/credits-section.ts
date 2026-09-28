import { Component, inject, input, signal, effect, viewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PeopleService } from '@core/services/people.service';
import { PersonCredit } from '@core/models/person-credits.model';
import { Icon } from '@shared/components/icon/icon';
import { Loader } from '@shared/components/loader/loader';

@Component({
  selector: 'app-credits-section',
  imports: [RouterLink, Icon, Loader],
  templateUrl: './credits-section.html',
  styleUrl: './credits-section.scss',
})
export class CreditsSection {
  private peopleService = inject(PeopleService);

  id = input.required<string>();

  credits = signal<PersonCredit[]>([]);
  loading = signal(true);

  slider = viewChild<ElementRef<HTMLDivElement>>('slider');
  canScrollLeft = signal(false);
  canScrollRight = signal(false);

  private readonly CARD_WIDTH = 162;

  constructor() {
    effect(() => {
      const personId = this.id();
      if (personId) {
        this.peopleService.getCredits(personId).subscribe({
          next: (data) => {
            this.credits.set(data.credits);
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

  detailLink(credit: PersonCredit): string[] {
    return credit.mediaType === 'movie'
      ? ['/movies', String(credit.id)]
      : ['/tv', String(credit.id)];
  }
}
