export interface GenreDto {
  id: number;
  name: string;
}

export interface GenreListDto {
  genres: GenreDto[];
}
