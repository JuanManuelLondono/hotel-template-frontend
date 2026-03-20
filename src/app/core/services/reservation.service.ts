import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Reservation, ReservationRequest } from '../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {

  private readonly API = 'http://localhost:8080/api/reservations';

  constructor(private http: HttpClient) {}

  getMyReservations(): Observable<ApiResponse<Reservation[]>> {
    return this.http.get<ApiResponse<Reservation[]>>(`${this.API}/my`);
  }

  getByHotel(hotelId: number): Observable<ApiResponse<Reservation[]>> {
    return this.http.get<ApiResponse<Reservation[]>>(`${this.API}/hotel/${hotelId}`);
  }

  getByCode(code: string): Observable<ApiResponse<Reservation>> {
    return this.http.get<ApiResponse<Reservation>>(`${this.API}/code/${code}`);
  }

  create(dto: ReservationRequest): Observable<ApiResponse<Reservation>> {
    return this.http.post<ApiResponse<Reservation>>(this.API, dto);
  }

  cancel(id: number, reason?: string): Observable<ApiResponse<Reservation>> {
    const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
    return this.http.patch<ApiResponse<Reservation>>(`${this.API}/${id}/cancel${params}`, {});
  }

  confirmPayment(id: number): Observable<ApiResponse<Reservation>> {
    return this.http.patch<ApiResponse<Reservation>>(`${this.API}/${id}/confirm-payment`, {});
  }
}