export interface Review {
  id: number;
  userName: string;
  rating: number;
  ratingCleanliness: number;
  ratingComfort: number;
  ratingLocation: number;
  ratingService: number;
  ratingValue: number;
  title: string;
  comment: string;
  hotelResponse: string;
  hotelResponseAt: string;
  verifiedStay: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface ReviewRequest {
  rating: number;
  ratingCleanliness?: number;
  ratingComfort?: number;
  ratingLocation?: number;
  ratingService?: number;
  ratingValue?: number;
  title?: string;
  comment: string;
}
