import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieListResponse } from '../models/movie.model';
import { MovieDetail } from '../models/movie-detail.model';
import { MovieCredits } from '../models/movie-credits.model';
import { MovieImages } from '../models/movie-images.model';
import { MovieReviews } from '../models/movie-reviews.model';

@Service()
export class MovieService {
  private http = inject(HttpClient);
  private apiUrl = '/api';

  getPopular(page: number = 1, lang: string = 'en-US'): Observable<MovieListResponse> {
    return this.http.get<MovieListResponse>(`${this.apiUrl}/movies/popular`, {
      params: { lang, page: String(page) },
    });
  }

  getMovieDetail(id: string, lang: string = 'en-US'): Observable<MovieDetail> {
    return this.http.get<MovieDetail>(`${this.apiUrl}/movies/${id}`, {
      params: { lang },
    });
  }

  getMovieCredits(id: string, lang: string = 'en-US'): Observable<MovieCredits> {
    return this.http.get<MovieCredits>(`${this.apiUrl}/movies/${id}/credits`, {
      params: { lang },
    });
  }

  getMovieImages(id: string): Observable<MovieImages> {
    return this.http.get<MovieImages>(`${this.apiUrl}/movies/${id}/images`);
  }

  getMovieReviews(id: string, lang: string = 'en-US'): Observable<MovieReviews> {
    return this.http.get<MovieReviews>(`${this.apiUrl}/movies/${id}/reviews`, {
      params: { lang },
    });
  }
}
