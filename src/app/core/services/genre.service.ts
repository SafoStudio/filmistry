import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenreList } from '../models/genre.model';

@Service()
export class GenreService {
  private http = inject(HttpClient);
  private apiUrl = '/api/genres';

  getMovieGenres(lang: string = 'en-US'): Observable<GenreList> {
    return this.http.get<GenreList>(`${this.apiUrl}/movie`, {
      params: { lang },
    });
  }

  getTvGenres(lang: string = 'en-US'): Observable<GenreList> {
    return this.http.get<GenreList>(`${this.apiUrl}/tv`, {
      params: { lang },
    });
  }
}
