import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieListResponse } from '../models/movie.model';

@Service()
export class Movie {
  private http = inject(HttpClient);
  private apiUrl = '/api';

  getPopular(lang: string = 'en-US'): Observable<MovieListResponse> {
    return this.http.get<MovieListResponse>(`${this.apiUrl}/movies/popular`, {
      params: { lang },
    });
  }
}
