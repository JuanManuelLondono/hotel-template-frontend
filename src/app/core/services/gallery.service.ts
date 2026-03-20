import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

export interface GalleryImage {
  id: number;
  imageUrl: string;
  altText: string;
  caption: string;
  category: string;
  displayOrder: number;
  width: number;
  height: number;
}

@Injectable({ providedIn: 'root' })
export class GalleryService {

  private readonly API = 'http://localhost:8080/api/gallery';

  constructor(private http: HttpClient) {}

  getByHotel(hotelId: number): Observable<ApiResponse<GalleryImage[]>> {
    return this.http.get<ApiResponse<GalleryImage[]>>(`${this.API}/hotel/${hotelId}`);
  }

  getByCategory(hotelId: number, category: string): Observable<ApiResponse<GalleryImage[]>> {
    return this.http.get<ApiResponse<GalleryImage[]>>(
      `${this.API}/hotel/${hotelId}/category/${category}`
    );
  }

  getByRoomType(roomTypeId: number): Observable<ApiResponse<GalleryImage[]>> {
    return this.http.get<ApiResponse<GalleryImage[]>>(`${this.API}/room-type/${roomTypeId}`);
  }

  upload(hotelId: number, formData: FormData): Observable<ApiResponse<GalleryImage>> {
    return this.http.post<ApiResponse<GalleryImage>>(
      `${this.API}/hotel/${hotelId}/upload`, formData
    );
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API}/${id}`);
  }
}