import { ReviewDto, MediaReviewsDto } from '../dto/media-reviews.dto';

interface TmdbReviewRaw {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details?: {
    rating: number | null;
  };
}

export interface TmdbMediaReviewsRaw {
  results: TmdbReviewRaw[];
}

const MAX_REVIEWS = 10;

export function toMediaReviewsDto(raw: TmdbMediaReviewsRaw): MediaReviewsDto {
  return {
    reviews: raw.results.slice(0, MAX_REVIEWS).map((r): ReviewDto => ({
      id: r.id,
      author: r.author,
      content: r.content,
      createdAt: r.created_at,
      rating: r.author_details?.rating ?? null,
    })),
  };
}
