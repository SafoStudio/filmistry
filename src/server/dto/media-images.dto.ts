export interface MediaImageDto {
  path: string;
  url: string;
  width: number;
  height: number;
}

export interface MediaImagesDto {
  backdrops: MediaImageDto[];
}
