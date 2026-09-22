export interface MovieImageDto {
  url: string;
  width: number;
  height: number;
}

export interface MovieImagesDto {
  backdrops: MovieImageDto[];
}
