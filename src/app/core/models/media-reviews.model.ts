export interface Review {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  rating: number | null;
}

export interface MediaReviews {
  reviews: Review[];
}
