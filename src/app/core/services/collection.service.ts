import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Collection } from '../models/collection.model';

@Service()
export class CollectionService {
  private http = inject(HttpClient);
  private apiUrl = '/api/collections';

  getCollection(id: number, lang: string = 'en-US'): Observable<Collection> {
    return this.http.get<Collection>(`${this.apiUrl}/${id}`, {
      params: { lang },
    });
  }
}
