export interface ReviewDto {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  rating: number | null;
}

export interface MediaReviewsDto {
  reviews: ReviewDto[];
}
