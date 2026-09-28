import { Component, inject, signal, OnInit } from '@angular/core';
import { PeopleService } from '@core/services/people.service';
import { PersonListItem } from '@core/models/person.model';
import { PersonCard } from '../../components/person-card/person-card';
import { Loader } from '@shared/components/loader/loader';

@Component({
  selector: 'app-people-page',
  imports: [PersonCard, Loader],
  templateUrl: './people-page.html',
  styleUrl: './people-page.scss',
})
export class PeoplePage implements OnInit {
  private peopleService = inject(PeopleService);

  people = signal<PersonListItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
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
