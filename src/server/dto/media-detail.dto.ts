import { MediaListItemDto } from './media.dto';

export interface CollectionLinkDto {
  id: number;
  name: string;
  posterUrl: string | null;
}

export interface MediaDetailDto {
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
  recommendations: MediaListItemDto[];
  belongsToCollection: CollectionLinkDto | null;
}
