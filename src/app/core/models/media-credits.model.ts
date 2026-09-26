export interface CastMember {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
}

export interface MediaCredits {
  cast: CastMember[];
}
