export interface MediaImage {
  path: string;
  url: string;
  width: number;
  height: number;
}

export interface MediaImages {
  backdrops: MediaImage[];
}
