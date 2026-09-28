import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonList } from '../models/person.model';
import { PersonDetail } from '../models/person-detail.model';
import { PersonCredits } from '../models/person-credits.model';

@Service()
export class PeopleService {
  private http = inject(HttpClient);
  private apiUrl = '/api/people';

  getPopular(lang: string = 'en-US'): Observable<PersonList> {
    return this.http.get<PersonList>(`${this.apiUrl}/popular`, {
      params: { lang },
    });
  }

  getDetail(id: string, lang: string = 'en-US'): Observable<PersonDetail> {
    return this.http.get<PersonDetail>(`${this.apiUrl}/${id}`, {
      params: { lang },
    });
  }

  getCredits(id: string, lang: string = 'en-US'): Observable<PersonCredits> {
    return this.http.get<PersonCredits>(`${this.apiUrl}/${id}/credits`, {
      params: { lang },
    });
  }
}
