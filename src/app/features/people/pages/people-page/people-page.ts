import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { PeopleService } from '@core/services/people.service';
import { NavigationStateService } from '@core/services/navigation-state.service';
import { PersonListItem } from '@core/models/person.model';
import { PersonCard } from '../../components/person-card/person-card';
import { Loader } from '@shared/components/loader/loader';

interface PeoplePageState {
  people: PersonListItem[];
}

@Component({
  selector: 'app-people-page',
  imports: [PersonCard, Loader],
  templateUrl: './people-page.html',
  styleUrl: './people-page.scss',
})
export class PeoplePage implements OnInit, OnDestroy {
  private peopleService = inject(PeopleService);
  private navState = inject(NavigationStateService);

  people = signal<PersonListItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  private readonly stateKey = '/people';

  ngOnInit(): void {
    const cached = this.navState.get<PeoplePageState>(this.stateKey);

    if (cached && cached.data.people.length > 0) {
      this.people.set(cached.data.people);
      this.loading.set(false);
      this.error.set(null);

      requestAnimationFrame(() => {
        window.scrollTo({ top: cached.scrollTop, behavior: 'instant' });
      });
      return;
    }

    this.load();
  }

  ngOnDestroy(): void {
    if (this.people().length === 0) return;

    this.navState.save<PeoplePageState>(this.stateKey, { people: this.people() }, window.scrollY);
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.peopleService.getPopular().subscribe({
      next: (data) => {
        this.people.set(data.results);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load people');
        this.loading.set(false);
      },
    });
  }
}
