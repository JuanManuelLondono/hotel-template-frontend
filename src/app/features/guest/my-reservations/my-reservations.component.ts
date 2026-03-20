import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../../core/services/reservation.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { Reservation, ReservationStatus } from '../../../core/models/reservation.model';
import { CurrencyCopPipe } from '../../../shared/pipes/currency-cop.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LoadingSpinnerComponent, CurrencyCopPipe],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="font-serif text-3xl font-bold text-gray-900">Mis Reservas</h1>
        <p class="text-gray-500 mt-1">Gestiona todas tus reservas</p>
      </div>

      @if (loading()) {
        <app-loading-spinner text="Cargando reservas..." />
      } @else if (reservations().length === 0) {
        <div class="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <span class="text-5xl">🛏</span>
          <p class="text-gray-500 mt-4 text-lg">No tienes reservas aún</p>
          <a routerLink="/hotels"
             class="mt-4 inline-block bg-primary-500 hover:bg-primary-600
                    text-white px-6 py-2.5 rounded-xl text-sm font-semibold
                    transition-colors">
            Explorar hoteles
          </a>
        </div>
      } @else {
        <div class="flex flex-col gap-4">
          @for (reservation of reservations(); track reservation.id) {
            <div class="bg-white border border-gray-100 rounded-2xl shadow-sm
                        overflow-hidden">

              <!-- Header de la tarjeta -->
              <div class="flex justify-between items-center px-6 py-4
                          border-b border-gray-50">
                <div>
                  <p class="text-xs text-gray-400">Código de reserva</p>
                  <p class="font-mono font-bold text-gray-900">
                    {{ reservation.reservationCode }}
                  </p>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-semibold"
                      [class]="getStatusClass(reservation.status)">
                  {{ getStatusLabel(reservation.status) }}
                </span>
              </div>

              <!-- Body -->
              <div class="px-6 py-4">
                <div class="flex flex-col sm:flex-row sm:justify-between gap-4">

                  <!-- Info hotel y habitación -->
                  <div>
                    <h3 class="font-serif text-lg font-bold text-gray-900">
                      {{ reservation.hotelName }}
                    </h3>
                    <p class="text-gray-500 text-sm">
                      {{ reservation.roomTypeName }} · Hab. {{ reservation.roomNumber }}
                    </p>

                    <!-- Fechas -->
                    <div class="flex items-center gap-4 mt-3">
                      <div>
                        <p class="text-xs text-gray-400">Check-in</p>
                        <p class="font-semibold text-sm text-gray-800">
                          {{ reservation.checkIn | date:'mediumDate' }}
                        </p>
                      </div>
                      <div class="text-gray-300">→</div>
                      <div>
                        <p class="text-xs text-gray-400">Check-out</p>
                        <p class="font-semibold text-sm text-gray-800">
                          {{ reservation.checkOut | date:'mediumDate' }}
                        </p>
                      </div>
                      <div class="bg-gray-100 px-2 py-1 rounded-lg">
                        <p class="text-xs font-medium text-gray-600">
                          {{ reservation.totalNights }} noche{{ reservation.totalNights !== 1 ? 's' : '' }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Precio -->
                  <div class="sm:text-right">
                    <p class="text-xs text-gray-400">Total pagado</p>
                    <p class="font-bold text-2xl text-primary-600">
                      {{ reservation.finalPrice | currencyCop }}
                    </p>
                    <p class="text-xs text-gray-400">
                      {{ reservation.pricePerNight | currencyCop }}/noche
                      · {{ reservation.guestsCount }} huésped{{ reservation.guestsCount !== 1 ? 'es' : '' }}
                    </p>
                  </div>
                </div>

                <!-- Requests especiales -->
                @if (reservation.specialRequests) {
                  <div class="mt-4 p-3 bg-gray-50 rounded-xl">
                    <p class="text-xs text-gray-500">
                      💬 {{ reservation.specialRequests }}
                    </p>
                  </div>
                }
              </div>

              <!-- Footer con acciones -->
              <div class="px-6 py-3 bg-gray-50 flex justify-between items-center">
                <p class="text-xs text-gray-400">
                  Reservado el {{ reservation.createdAt | date:'mediumDate' }}
                </p>

                @if (canCancel(reservation.status)) {
                  <button
                    (click)="cancelReservation(reservation)"
                    [disabled]="cancelling() === reservation.id"
                    class="text-sm text-red-600 hover:text-red-700 font-medium
                           transition-colors disabled:opacity-50">
                    {{ cancelling() === reservation.id
                      ? 'Cancelando...' : 'Cancelar reserva' }}
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>

    <!-- Modal de confirmación de cancelación -->
    @if (showCancelModal()) {
      <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <h3 class="font-serif text-xl font-bold text-gray-900">
            ¿Cancelar reserva?
          </h3>
          <p class="text-gray-500 text-sm mt-2">
            Esta acción no se puede deshacer. ¿Estás seguro de que quieres
            cancelar la reserva <strong>{{ selectedReservation()?.reservationCode }}</strong>?
          </p>
          <textarea
            [(ngModel)]="cancelReason"
            placeholder="Motivo de cancelación (opcional)"
            rows="3"
            class="w-full mt-4 px-4 py-2.5 border border-gray-200 rounded-xl
                   text-sm outline-none focus:border-primary-500 resize-none">
          </textarea>
          <div class="flex gap-3 mt-4">
            <button
              (click)="showCancelModal.set(false)"
              class="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700
                     py-2.5 rounded-xl text-sm font-medium transition-colors">
              Mantener reserva
            </button>
            <button
              (click)="confirmCancel()"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5
                     rounded-xl text-sm font-semibold transition-colors">
              Sí, cancelar
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class MyReservationsComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private toast = inject(ToastService);

  reservations      = signal<Reservation[]>([]);
  loading           = signal(true);
  cancelling        = signal<number | null>(null);
  showCancelModal   = signal(false);
  selectedReservation = signal<Reservation | null>(null);
  cancelReason      = '';

  ngOnInit() {
    this.reservationService.getMyReservations().subscribe({
      next: res => {
        this.reservations.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  canCancel(status: ReservationStatus): boolean {
    return status === 'PENDING' || status === 'CONFIRMED';
  }

  cancelReservation(reservation: Reservation) {
    this.selectedReservation.set(reservation);
    this.cancelReason = '';
    this.showCancelModal.set(true);
  }

  confirmCancel() {
    const reservation = this.selectedReservation();
    if (!reservation) return;

    this.cancelling.set(reservation.id);
    this.showCancelModal.set(false);

    this.reservationService.cancel(reservation.id, this.cancelReason).subscribe({
      next: res => {
        this.reservations.update(list =>
          list.map(r => r.id === reservation.id ? res.data : r)
        );
        this.toast.success('Reserva cancelada exitosamente');
        this.cancelling.set(null);
      },
      error: err => {
        this.toast.error(err.error?.message || 'Error al cancelar la reserva');
        this.cancelling.set(null);
      }
    });
  }

  getStatusClass(status: ReservationStatus): string {
    const classes: Record<ReservationStatus, string> = {
      PENDING:    'bg-amber-100 text-amber-700',
      CONFIRMED:  'bg-blue-100 text-blue-700',
      CHECKED_IN: 'bg-green-100 text-green-700',
      CHECKED_OUT:'bg-gray-100 text-gray-600',
      CANCELLED:  'bg-red-100 text-red-700',
      NO_SHOW:    'bg-red-100 text-red-700',
    };
    return classes[status] ?? 'bg-gray-100 text-gray-600';
  }

  getStatusLabel(status: ReservationStatus): string {
    const labels: Record<ReservationStatus, string> = {
      PENDING:    'Pendiente',
      CONFIRMED:  'Confirmada',
      CHECKED_IN: 'En curso',
      CHECKED_OUT:'Finalizada',
      CANCELLED:  'Cancelada',
      NO_SHOW:    'No se presentó',
    };
    return labels[status] ?? status;
  }
}