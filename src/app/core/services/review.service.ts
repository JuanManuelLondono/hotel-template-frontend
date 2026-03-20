import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Review, ReviewRequest } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {

  private readonly API = 'http://localhost:8080/api/reviews';

  constructor(private http: HttpClient) {}

  getByHotel(hotelId: number): Observable<ApiResponse<Review[]>> {
    return this.http.get<ApiResponse<Review[]>>(`${this.API}/hotel/${hotelId}`);
  }

  create(hotelId: number, dto: ReviewRequest): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(`${this.API}/hotel/${hotelId}`, dto);
  }

  addResponse(reviewId: number, response: string): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(
      `${this.API}/${reviewId}/response?response=${encodeURIComponent(response)}`, {}
    );
  }

  hide(reviewId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API}/${reviewId}`);
  }
}