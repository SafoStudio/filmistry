import {
  Component,
  inject,
  signal,
  effect,
  input,
  viewChild,
  ElementRef,
  afterNextRender,
  OnDestroy,
} from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PeopleService } from '@core/services/people.service';
import { NavigationStateService } from '@core/services/navigation-state.service';
import { PersonDetail } from '@core/models/person-detail.model';
import { Loader } from '@shared/components/loader/loader';
import { PageCurl } from '@shared/components/page-curl/page-curl';
import { Icon } from '@shared/components/icon/icon';
import { CreditsSection } from './sections/credits-section/credits-section';
import { ExternalLinks } from '@shared/components/external-links/external-links';
import { ExternalIds } from '@core/models/external-ids.model';

interface PersonDetailState {
  person: PersonDetail;
  externalIds: ExternalIds | null;
}

@Component({
  selector: 'app-person-detail-page',
  imports: [Loader, PageCurl, Icon, CreditsSection, ExternalLinks],
  templateUrl: './person-detail-page.html',
  styleUrl: './person-detail-page.scss',
})
export class PersonDetailPage implements OnDestroy {
  private peopleService = inject(PeopleService);
  private router = inject(Router);
  private location = inject(Location);
  private navState = inject(NavigationStateService);

  id = input.required<string>();

  person = signal<PersonDetail | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  isClosing = signal(false);
  isBioExpanded = signal(false);
  isBioOverflowing = signal(false);
  externalIds = signal<ExternalIds | null>(null);

  bioRef = viewChild<ElementRef<HTMLParagraphElement>>('bio');
  leftColRef = viewChild<ElementRef<HTMLDivElement>>('leftCol');

  private stateKey = '';

  constructor() {
    effect(() => {
      const personId = this.id();
      if (personId) {
        this.isClosing.set(false);
        this.tryLoad(personId);
      }
    });

    afterNextRender(() => {
      this.checkBioOverflow();
    });
  }

  ngOnDestroy(): void {
    const currentPerson = this.person();
    if (!currentPerson) return;

    this.navState.save<PersonDetailState>(
      this.stateKey,
      { person: currentPerson, externalIds: this.externalIds() },
      window.scrollY,
    );
  }

  private tryLoad(id: string): void {
    this.stateKey = `/people/${id}`;

    const cached = this.navState.get<PersonDetailState>(this.stateKey);

    if (cached) {
      this.person.set(cached.data.person);
      this.externalIds.set(cached.data.externalIds ?? null);
      this.loading.set(false);
      this.error.set(null);

      requestAnimationFrame(() => {
        window.scrollTo({ top: cached.scrollTop, behavior: 'instant' });
        setTimeout(() => this.checkBioOverflow());
      });
      return;
    }

    this.load(id);
  }

  private load(id: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.externalIds.set(null);

    this.peopleService.getDetail(id).subscribe({
      next: (data) => {
        this.person.set(data);
        this.loading.set(false);
        setTimeout(() => this.checkBioOverflow());
      },
      error: () => {
        this.error.set('Failed to load person details');
        this.loading.set(false);
      },
    });

    this.peopleService.getExternalIds(id).subscribe({
      next: (ids) => this.externalIds.set(ids),
      error: () => this.externalIds.set(null),
    });
  }

  private checkBioOverflow(): void {
    const bio = this.bioRef()?.nativeElement;
    const leftCol = this.leftColRef()?.nativeElement;
    if (!bio || !leftCol) return;

    if (this.isBioExpanded()) {
      bio.style.maxHeight = 'none';
      this.isBioOverflowing.set(true);
      return;
    }

    const leftHeight = leftCol.offsetHeight;
    bio.style.maxHeight = 'none';
    const bioHeight = bio.scrollHeight;

    if (bioHeight > leftHeight) {
      bio.style.maxHeight = `${leftHeight}px`;
      this.isBioOverflowing.set(true);
    } else {
      bio.style.maxHeight = 'none';
      this.isBioOverflowing.set(false);
    }
  }

  toggleBio(): void {
    this.isBioExpanded.update((v) => !v);
    setTimeout(() => this.checkBioOverflow());
  }

  closeDetail(): void {
    if (this.isClosing()) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasHistory = window.history.length > 1;

    if (reducedMotion) {
      this.goBack(hasHistory);
      return;
    }

    this.isClosing.set(true);
    setTimeout(() => this.goBack(hasHistory), 700);
  }

  private goBack(hasHistory: boolean): void {
    if (hasHistory) {
      this.location.back();
    } else {
      this.router.navigate(['/people']);
    }
  }
}
