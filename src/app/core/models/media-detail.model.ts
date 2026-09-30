import { Media } from './media.model';

export interface MediaDetail {
  id: number;
  title: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseYear: string;
  runtime: number;
  voteAverage: number;
  genres: string[];
  trailerKey: string | null;
  recommendations: Media[];
}
