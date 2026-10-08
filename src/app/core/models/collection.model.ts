import { Media } from './media.model';

export interface Collection {
  id: number;
  name: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  parts: Media[];
}
