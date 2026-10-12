import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MediaListResponse } from '../models/media.model';
import { MediaDetail } from '../models/media-detail.model';
import { MediaCredits } from '../models/media-credits.model';
import { MediaImages } from '../models/media-images.model';
import { MediaReviews } from '../models/media-reviews.model';
import { ExternalIds } from '../models/external-ids.model';

@Service()
export class MovieService {
  private http = inject(HttpClient);
  private apiUrl = '/api/movies';

  getPopular(page: number = 1, lang: string = 'en-US'): Observable<MediaListResponse> {
    return this.http.get<MediaListResponse>(`${this.apiUrl}/popular`, {
      params: { lang, page: String(page) },
    });
  }

  getDetail(id: string, lang: string = 'en-US'): Observable<MediaDetail> {
    return this.http.get<MediaDetail>(`${this.apiUrl}/${id}`, {
      params: { lang },
    });
  }

  getCredits(id: string, lang: string = 'en-US'): Observable<MediaCredits> {
    return this.http.get<MediaCredits>(`${this.apiUrl}/${id}/credits`, {
      params: { lang },
    });
  }

  getImages(id: string): Observable<MediaImages> {
    return this.http.get<MediaImages>(`${this.apiUrl}/${id}/images`);
  }

  getReviews(id: string, lang: string = 'en-US'): Observable<MediaReviews> {
    return this.http.get<MediaReviews>(`${this.apiUrl}/${id}/reviews`, {
      params: { lang },
    });
  }

  getExternalIds(id: string): Observable<ExternalIds> {
    return this.http.get<ExternalIds>(`${this.apiUrl}/${id}/external_ids`);
  }
}
