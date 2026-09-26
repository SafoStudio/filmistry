import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieListResponse } from '../models/media.model';
import { MovieDetail } from '../models/media-detail.model';
import { MovieCredits } from '../models/media-credits.model';
import { MovieImages } from '../models/media-images.model';
import { MovieReviews } from '../models/media-reviews.model';
import { Trending } from '../models/trending.model';

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

  getTrending(lang: string = 'en-US'): Observable<Trending> {
    return this.http.get<Trending>(`${this.apiUrl}/trending`, {
      params: { lang },
    });
  }
}
