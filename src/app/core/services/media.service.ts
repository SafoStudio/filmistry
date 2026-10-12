import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieService } from './movie.service';
import { TvService } from './tv.service';
import { MediaListResponse } from '../models/media.model';
import { MediaDetail } from '../models/media-detail.model';
import { MediaCredits } from '../models/media-credits.model';
import { MediaImages } from '../models/media-images.model';
import { MediaReviews } from '../models/media-reviews.model';
import { Trending } from '../models/trending.model';
import { TvSeasonDetail } from '@core/models/tv-season.model';
import { ExternalIds } from '../models/external-ids.model';

export type MediaType = 'movie' | 'tv';

@Service()
export class MediaService {
  private http = inject(HttpClient);
  private movieService = inject(MovieService);
  private tvService = inject(TvService);

  getList(
    mediaType: MediaType,
    page: number = 1,
    lang: string = 'en-US',
  ): Observable<MediaListResponse> {
    return mediaType === 'movie'
      ? this.movieService.getPopular(page, lang)
      : this.tvService.getTopRated(page, lang);
  }

  getDetail(mediaType: MediaType, id: string, lang: string = 'en-US'): Observable<MediaDetail> {
    return mediaType === 'movie'
      ? this.movieService.getDetail(id, lang)
      : this.tvService.getDetail(id, lang);
  }

  getCredits(mediaType: MediaType, id: string, lang: string = 'en-US'): Observable<MediaCredits> {
    return mediaType === 'movie'
      ? this.movieService.getCredits(id, lang)
      : this.tvService.getCredits(id, lang);
  }

  getImages(mediaType: MediaType, id: string): Observable<MediaImages> {
    return mediaType === 'movie' ? this.movieService.getImages(id) : this.tvService.getImages(id);
  }

  getReviews(mediaType: MediaType, id: string, lang: string = 'en-US'): Observable<MediaReviews> {
    return mediaType === 'movie'
      ? this.movieService.getReviews(id, lang)
      : this.tvService.getReviews(id, lang);
  }

  getTrending(lang: string = 'en-US'): Observable<Trending> {
    return this.http.get<Trending>('/api/trending', {
      params: { lang },
    });
  }

  getTrendingMoviesDay(lang: string = 'en-US'): Observable<Trending> {
    return this.http.get<Trending>('/api/trending/day', {
      params: { lang },
    });
  }

  getSeasonDetail(
    tvId: string,
    seasonNumber: number,
    lang: string = 'en-US',
  ): Observable<TvSeasonDetail> {
    return this.tvService.getSeasonDetail(tvId, seasonNumber, lang);
  }

  getExternalIds(mediaType: MediaType, id: string): Observable<ExternalIds> {
    return mediaType === 'movie'
      ? this.movieService.getExternalIds(id)
      : this.tvService.getExternalIds(id);
  }
}
