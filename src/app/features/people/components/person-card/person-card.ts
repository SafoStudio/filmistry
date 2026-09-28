import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PersonListItem } from '@core/models/person.model';

@Component({
  selector: 'app-person-card',
  imports: [RouterLink],
  templateUrl: './person-card.html',
  styleUrl: './person-card.scss',
})
export class PersonCard {
  person = input.required<PersonListItem>();
}
