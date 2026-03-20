import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../core/services/review.service';
import { HotelService } from '../../../core/services/hotel.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { HotelSummary } from '../../../core/models/hotel.model';
import { Review } from '../../../core/models/review.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, StarRatingComponent, FormsModule],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <div class="mb-8">
        <h1 class="font-serif text-3xl font-bold text-gray-900">Reseñas</h1>
        <p class="text-gray-500 mt-1">Modera las reseñas de los huéspedes</p>
      </div>

      <!-- Selector hotel -->
      <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-6">
        <label class="text-sm font-medium text-gray-700 mr-3">Hotel:</label>
        <select (change)="onHotelChange($event)"
                class="px-4 py-2 border border-gray-200 rounded-xl text-sm
                       outline-none focus:border-primary-500 bg-white">
          <option value="">Selecciona un hotel</option>
          @for (hotel of hotels(); track hotel.id) {
            <option [value]="hotel.id">{{ hotel.name }}</option>
          }
        </select>
      </div>

      @if (loading()) {
        <app-loading-spinner text="Cargando reseñas..." />
      } @else if (!selectedHotelId()) {
        <div class="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <span class="text-4xl">⭐</span>
          <p class="text-gray-400 mt-3">Selecciona un hotel para ver sus reseñas</p>
        </div>
      } @else if (reviews().length === 0) {
        <div class="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <span class="text-4xl">💬</span>
          <p class="text-gray-400 mt-3">No hay reseñas para este hotel</p>
        </div>
      } @else {
        <div class="flex flex-col gap-4">
          @for (review of reviews(); track review.id) {
            <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <div class="flex justify-between items-start">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 bg-primary-100 rounded-full flex items-center
                              justify-center text-primary-600 font-bold text-sm">
                    {{ review.userName.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-semibold text-sm text-gray-900">
                      {{ review.userName }}
                    </p>
                    <app-star-rating [rating]="review.rating" [readonly]="true" />
                  </div>
                </div>
                <button
                  (click)="hideReview(review)"
                  class="text-xs text-red-600 hover:text-red-700 border
                         border-red-200 px-3 py-1.5 rounded-lg transition-colors">
                  Ocultar
                </button>
              </div>

              @if (review.title) {
                <p class="font-semibold text-gray-900 mt-3">{{ review.title }}</p>
              }
              <p class="text-gray-600 text-sm mt-1">{{ review.comment }}</p>

              <!-- Responder -->
              @if (!review.hotelResponse) {
                <div class="mt-4 flex gap-2">
                  <input type="text"
                         [(ngModel)]="responses[review.id]"
                         placeholder="Responder al huésped..."
                         class="flex-1 px-4 py-2 border border-gray-200 rounded-xl
                                text-sm outline-none focus:border-primary-500"/>
                  <button
                    (click)="respond(review)"
                    [disabled]="!responses[review.id]"
                    class="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300
                           text-white px-4 py-2 rounded-xl text-sm font-medium
                           transition-colors">
                    Responder
                  </button>
                </div>
              } @else {
                <div class="mt-3 p-3 bg-primary-50 rounded-xl border-l-4
                            border-primary-400">
                  <p class="text-xs font-semibold text-primary-700 mb-1">
                    Respuesta del hotel
                  </p>
                  <p class="text-sm text-gray-700">{{ review.hotelResponse }}</p>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `
})
export class ReviewsComponent implements OnInit {
  private reviewService = inject(ReviewService);
  private hotelService  = inject(HotelService);
  private toast         = inject(ToastService);

  hotels          = signal<HotelSummary[]>([]);
  reviews         = signal<Review[]>([]);
  loading         = signal(false);
  selectedHotelId = signal<number | null>(null);
  responses: Record<number, string> = {};

  ngOnInit() {
    this.hotelService.findAll().subscribe({
      next: res => this.hotels.set(res.data)
    });
  }

  onHotelChange(event: Event) {
    const id = Number((event.target as HTMLSelectElement).value);
    if (!id) return;
    this.selectedHotelId.set(id);
    this.loading.set(true);
    this.reviewService.getByHotel(id).subscribe({
      next: res => {
        this.reviews.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  hideReview(review: Review) {
    if (!confirm('¿Ocultar esta reseña?')) return;
    this.reviewService.hide(review.id).subscribe({
      next: () => {
        this.reviews.update(list => list.filter(r => r.id !== review.id));
        this.toast.success('Reseña ocultada');
      },
      error: err => this.toast.error(err.error?.message || 'Error al ocultar')
    });
  }

  respond(review: Review) {
    const response = this.responses[review.id];
    if (!response?.trim()) return;
    this.reviewService.addResponse(review.id, response).subscribe({
      next: res => {
        this.reviews.update(list =>
          list.map(r => r.id === review.id ? res.data : r)
        );
        delete this.responses[review.id];
        this.toast.success('Respuesta publicada');
      },
      error: err => this.toast.error(err.error?.message || 'Error al responder')
    });
  }
}