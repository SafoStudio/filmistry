export interface CastMemberDto {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
}

export interface MovieCreditsDto {
  cast: CastMemberDto[];
}
