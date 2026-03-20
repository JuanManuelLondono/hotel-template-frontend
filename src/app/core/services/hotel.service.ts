import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Hotel, HotelSummary, HotelRequest } from '../models/hotel.model';

@Injectable({ providedIn: 'root' })
export class HotelService {

  private readonly API = 'http://localhost:8080/api/hotels';

  constructor(private http: HttpClient) {}

  findAll(): Observable<ApiResponse<HotelSummary[]>> {
    return this.http.get<ApiResponse<HotelSummary[]>>(this.API);
  }

  findById(id: number): Observable<ApiResponse<Hotel>> {
    return this.http.get<ApiResponse<Hotel>>(`${this.API}/${id}`);
  }

  findByCity(city: string): Observable<ApiResponse<HotelSummary[]>> {
    return this.http.get<ApiResponse<HotelSummary[]>>(`${this.API}/city/${city}`);
  }

  findTopRated(): Observable<ApiResponse<HotelSummary[]>> {
    return this.http.get<ApiResponse<HotelSummary[]>>(`${this.API}/top-rated`);
  }

  create(dto: HotelRequest): Observable<ApiResponse<Hotel>> {
    return this.http.post<ApiResponse<Hotel>>(this.API, dto);
  }

  update(id: number, dto: HotelRequest): Observable<ApiResponse<Hotel>> {
    return this.http.put<ApiResponse<Hotel>>(`${this.API}/${id}`, dto);
  }

  deactivate(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API}/${id}`);
  }
}