import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchResponse } from '../models/search.model';

@Service()
export class SearchService {
  private http = inject(HttpClient);
  private apiUrl = '/api/search';

  searchMulti(q: string, page: number = 1, lang: string = 'en-US'): Observable<SearchResponse> {
    return this.http.get<SearchResponse>(`${this.apiUrl}/multi`, {
      params: { q, lang, page: String(page) },
    });
  }

  searchMovie(q: string, page: number = 1, lang: string = 'en-US'): Observable<SearchResponse> {
    return this.http.get<SearchResponse>(`${this.apiUrl}/movie`, {
      params: { q, lang, page: String(page) },
    });
  }

  searchTv(q: string, page: number = 1, lang: string = 'en-US'): Observable<SearchResponse> {
    return this.http.get<SearchResponse>(`${this.apiUrl}/tv`, {
      params: { q, lang, page: String(page) },
    });
  }

  searchPerson(q: string, page: number = 1, lang: string = 'en-US'): Observable<SearchResponse> {
    return this.http.get<SearchResponse>(`${this.apiUrl}/person`, {
      params: { q, lang, page: String(page) },
    });
  }
}
