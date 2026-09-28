export interface PersonListItemDto {
  id: number;
  name: string;
  profileUrl: string | null;
}

export interface PersonListDto {
  results: PersonListItemDto[];
}
