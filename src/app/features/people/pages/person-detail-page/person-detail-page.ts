import { Component, inject, signal, effect, input } from '@angular/core';
import { Router } from '@angular/router';
import { PeopleService } from '@core/services/people.service';
import { PersonDetail } from '@core/models/person-detail.model';
import { Loader } from '@shared/components/loader/loader';
import { PageCurl } from '@shared/components/page-curl/page-curl';
import { CreditsSection } from './sections/credits-section/credits-section';

@Component({
  selector: 'app-person-detail-page',
  imports: [Loader, PageCurl, CreditsSection],
  templateUrl: './person-detail-page.html',
  styleUrl: './person-detail-page.scss',
})
export class PersonDetailPage {
  private peopleService = inject(PeopleService);
  private router = inject(Router);

  id = input.required<string>();

  person = signal<PersonDetail | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  isClosing = signal(false);

  constructor() {
    effect(() => {
      const personId = this.id();
      if (personId) this.load(personId);
    });
  }

  private load(id: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.peopleService.getDetail(id).subscribe({
      next: (data) => {
        this.person.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load person details');
        this.loading.set(false);
      },
    });
  }

  closeDetail(): void {
    if (this.isClosing()) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      this.router.navigate(['/people']);
      return;
    }

    this.isClosing.set(true);
    setTimeout(() => {
      this.router.navigate(['/people']);
    }, 700);
  }
}
