export interface MediaImageDto {
  url: string;
  width: number;
  height: number;
}

export interface MediaImagesDto {
  backdrops: MediaImageDto[];
}
