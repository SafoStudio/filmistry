import { Component, inject, input, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PeopleService } from '@core/services/people.service';
import { PersonCredit } from '@core/models/person-credits.model';
import { CarouselComponent } from '@shared/components/carousel/carousel';

@Component({
  selector: 'app-credits-section',
  imports: [RouterLink, CarouselComponent],
  templateUrl: './credits-section.html',
  styleUrl: './credits-section.scss',
})
export class CreditsSection {
  private peopleService = inject(PeopleService);

  id = input.required<string>();

  credits = signal<PersonCredit[]>([]);
  loading = signal(true);

  constructor() {
    effect(() => {
      const personId = this.id();
      if (personId) {
        this.peopleService.getCredits(personId).subscribe({
          next: (data) => {
            this.credits.set(data.credits);
            this.loading.set(false);
          },
          error: () => this.loading.set(false),
        });
      }
    });
  }

  detailLink(credit: PersonCredit): string[] {
    return credit.mediaType === 'movie'
      ? ['/movies', String(credit.id)]
      : ['/tv', String(credit.id)];
  }
}
