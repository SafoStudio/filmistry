export interface PersonCreditDto {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterUrl: string | null;
  character: string | null;
}

export interface PersonCreditsDto {
  credits: PersonCreditDto[];
}
