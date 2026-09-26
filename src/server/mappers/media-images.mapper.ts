import { TMDB_IMAGE_BASE_URL, GALLERY_SIZE } from '../constants';
import { MediaImageDto, MediaImagesDto } from '../dto/media-images.dto';

interface TmdbImageRaw {
  file_path: string;
  width: number;
  height: number;
}

export interface TmdbMediaImagesRaw {
  backdrops: TmdbImageRaw[];
}

const MAX_BACKDROPS = 20;

export function toMediaImagesDto(raw: TmdbMediaImagesRaw): MediaImagesDto {
  return {
    backdrops: raw.backdrops.slice(0, MAX_BACKDROPS).map((img): MediaImageDto => ({
      url: `${TMDB_IMAGE_BASE_URL}/${GALLERY_SIZE}${img.file_path}`,
      width: img.width,
      height: img.height,
    })),
  };
}
