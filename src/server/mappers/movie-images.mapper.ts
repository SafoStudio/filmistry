import { TMDB_IMAGE_BASE_URL, GALLERY_SIZE } from '../constants';
import { MovieImageDto, MovieImagesDto } from '../dto/movie-images.dto';

interface TmdbImageRaw {
  file_path: string;
  width: number;
  height: number;
}

export interface TmdbImagesRaw {
  backdrops: TmdbImageRaw[];
}

const MAX_BACKDROPS = 20;

export function toMovieImagesDto(raw: TmdbImagesRaw): MovieImagesDto {
  return {
    backdrops: raw.backdrops.slice(0, MAX_BACKDROPS).map((img): MovieImageDto => ({
      url: `${TMDB_IMAGE_BASE_URL}/${GALLERY_SIZE}${img.file_path}`,
      width: img.width,
      height: img.height,
    })),
  };
}
