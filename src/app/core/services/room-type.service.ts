import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

export interface RoomType {
  id: number;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  coverImageUrl: string;
  active: boolean;
  hotelId: number;
  hotelName: string;
  amenities: Amenity[];
  availableRooms: number;
}

export interface Amenity {
  id: number;
  name: string;
  icon: string;
}

export interface RoomTypeRequest {
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  amenityIds?: number[];
}

@Injectable({ providedIn: 'root' })
export class RoomTypeService {

  private readonly API = 'http://localhost:8080/api/room-types';

  constructor(private http: HttpClient) {}

  findByHotel(hotelId: number): Observable<ApiResponse<RoomType[]>> {
    return this.http.get<ApiResponse<RoomType[]>>(`${this.API}/hotel/${hotelId}`);
  }

  findById(id: number): Observable<ApiResponse<RoomType>> {
    return this.http.get<ApiResponse<RoomType>>(`${this.API}/${id}`);
  }

  create(hotelId: number, dto: RoomTypeRequest): Observable<ApiResponse<RoomType>> {
    return this.http.post<ApiResponse<RoomType>>(`${this.API}/hotel/${hotelId}`, dto);
  }

  update(id: number, dto: RoomTypeRequest): Observable<ApiResponse<RoomType>> {
    return this.http.put<ApiResponse<RoomType>>(`${this.API}/${id}`, dto);
  }
}