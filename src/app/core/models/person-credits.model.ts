export interface PersonCredit {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterUrl: string | null;
  character: string | null;
}

export interface PersonCredits {
  credits: PersonCredit[];
}
