export interface HotelSummary {
  id: number;
  name: string;
  city: string;
  country: string;
  coverImageUrl: string;
  averageRating: number;
  totalReviews: number;
  minPrice: number;
}

export interface Hotel {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website: string;
  coverImageUrl: string;
  averageRating: number;
  totalReviews: number;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  active: boolean;
  createdAt: string;
  roomTypes: RoomTypeSummary[];
}

export interface RoomTypeSummary {
  id: number;
  name: string;
  pricePerNight: number;
  capacity: number;
  coverImageUrl: string;
  availableRooms: number;
}

export interface HotelRequest {
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  checkInTime?: string;
  checkOutTime?: string;
  cancellationPolicy?: string;
}