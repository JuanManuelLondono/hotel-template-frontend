export interface Reservation {
  id: number;
  reservationCode: string;
  userId: number;
  userName: string;
  userEmail: string;
  roomId: number;
  roomNumber: string;
  roomTypeName: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  pricePerNight: number;
  totalPrice: number;
  taxAmount: number;
  finalPrice: number;
  guestsCount: number;
  specialRequests: string;
  status: ReservationStatus;
  createdAt: string;
  paidAt: string;
}

export type ReservationStatus =
  'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'NO_SHOW';

export interface ReservationRequest {
  roomTypeId: number;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  specialRequests?: string;
}