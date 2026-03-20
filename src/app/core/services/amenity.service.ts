import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Amenity } from './room-type.service';

export interface AmenityRequest {
  name: string;
  icon?: string;
}

@Injectable({ providedIn: 'root' })
export class AmenityService {

  private readonly API = 'http://localhost:8080/api/amenities';

  constructor(private http: HttpClient) {}

  findAll(): Observable<ApiResponse<Amenity[]>> {
    return this.http.get<ApiResponse<Amenity[]>>(this.API);
  }

  create(dto: AmenityRequest): Observable<ApiResponse<Amenity>> {
    return this.http.post<ApiResponse<Amenity>>(this.API, dto);
  }

  update(id: number, dto: AmenityRequest): Observable<ApiResponse<Amenity>> {
    return this.http.put<ApiResponse<Amenity>>(`${this.API}/${id}`, dto);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API}/${id}`);
  }
}