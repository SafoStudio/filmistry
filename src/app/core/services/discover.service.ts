import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MediaListResponse } from '../models/media.model';
import { DiscoverParams } from '../models/discover.model';

@Service()
export class DiscoverService {
  private http = inject(HttpClient);
  private apiUrl = '/api/discover';

  discoverMovies(params: DiscoverParams, lang: string = 'en-US'): Observable<MediaListResponse> {
    return this.http.get<MediaListResponse>(`${this.apiUrl}/movie`, {
      params: this.buildParams(params, lang),
    });
  }

  discoverTv(params: DiscoverParams, lang: string = 'en-US'): Observable<MediaListResponse> {
    return this.http.get<MediaListResponse>(`${this.apiUrl}/tv`, {
      params: this.buildParams(params, lang),
    });
  }

  private buildParams(params: DiscoverParams, lang: string): Record<string, string> {
    const result: Record<string, string> = { lang };

    if (params.page) result['page'] = String(params.page);
    if (params.sort) result['sort'] = params.sort;
    if (params.genres) result['genres'] = params.genres;
    if (params.year) result['year'] = String(params.year);
    if (params.rating !== undefined) result['rating'] = String(params.rating);

    return result;
  }
}
