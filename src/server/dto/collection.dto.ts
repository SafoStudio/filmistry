import { MediaListItemDto } from './media.dto';

export interface CollectionDto {
  id: number;
  name: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  parts: MediaListItemDto[];
}
