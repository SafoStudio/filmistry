import { ExternalIdsDto, PersonExternalIdsDto } from '../dto/external-ids.dto';

export interface TmdbExternalIdsRaw {
  imdb_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
  wikidata_id: string | null;
}

export function toExternalIdsDto(raw: TmdbExternalIdsRaw): ExternalIdsDto {
  return {
    imdbId: raw.imdb_id ?? null,
    facebookId: raw.facebook_id ?? null,
    instagramId: raw.instagram_id ?? null,
    twitterId: raw.twitter_id ?? null,
    wikidataId: raw.wikidata_id ?? null,
  };
}

export interface TmdbPersonExternalIdsRaw {
  imdb_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
  wikidata_id: string | null;
  tiktok_id: string | null;
  youtube_id: string | null;
}

export function toPersonExternalIdsDto(raw: TmdbPersonExternalIdsRaw): PersonExternalIdsDto {
  return {
    imdbId: raw.imdb_id ?? null,
    facebookId: raw.facebook_id ?? null,
    instagramId: raw.instagram_id ?? null,
    twitterId: raw.twitter_id ?? null,
    wikidataId: raw.wikidata_id ?? null,
    tiktokId: raw.tiktok_id ?? null,
    youtubeId: raw.youtube_id ?? null,
  };
}
