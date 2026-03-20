import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../../core/services/reservation.service';
import { HotelService } from '../../../core/services/hotel.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { CurrencyCopPipe } from '../../../shared/pipes/currency-cop.pipe';
import { Reservation, ReservationStatus } from '../../../core/models/reservation.model';
import { HotelSummary } from '../../../core/models/hotel.model';

@Component({
  selector: 'app-admin-reservations',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, CurrencyCopPipe],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <div class="mb-8">
        <h1 class="font-serif text-3xl font-bold text-gray-900">Reservas</h1>
        <p class="text-gray-500 mt-1">Gestiona todas las reservas</p>
      </div>

      <!-- Selector de hotel -->
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
        <app-loading-spinner text="Cargando reservas..." />
      } @else if (!selectedHotelId()) {
        <div class="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <span class="text-4xl">🏨</span>
          <p class="text-gray-400 mt-3">Selecciona un hotel para ver sus reservas</p>
        </div>
      } @else if (reservations().length === 0) {
        <div class="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <span class="text-4xl">📋</span>
          <p class="text-gray-400 mt-3">No hay reservas para este hotel</p>
        </div>
      } @else {
        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500
                           uppercase">Código</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500
                           uppercase hidden sm:table-cell">Huésped</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500
                           uppercase hidden md:table-cell">Fechas</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500
                           uppercase">Estado</th>
                <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500
                           uppercase">Total</th>
                <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500
                           uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              @for (res of reservations(); track res.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4">
                    <p class="font-mono text-sm font-bold text-gray-900">
                      {{ res.reservationCode }}
                    </p>
                    <p class="text-xs text-gray-400">{{ res.roomTypeName }}</p>
                  </td>
                  <td class="px-6 py-4 hidden sm:table-cell">
                    <p class="text-sm font-medium text-gray-900">{{ res.userName }}</p>
                    <p class="text-xs text-gray-400">{{ res.userEmail }}</p>
                  </td>
                  <td class="px-6 py-4 hidden md:table-cell">
                    <p class="text-sm text-gray-700">
                      {{ res.checkIn | date:'mediumDate' }}
                    </p>
                    <p class="text-xs text-gray-400">
                      → {{ res.checkOut | date:'mediumDate' }}
                      · {{ res.totalNights }}n
                    </p>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold"
                          [class]="getStatusClass(res.status)">
                      {{ getStatusLabel(res.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <p class="font-bold text-sm text-primary-600">
                      {{ res.finalPrice | currencyCop }}
                    </p>
                  </td>
                  <td class="px-6 py-4 text-right">
                    @if (res.status === 'PENDING') {
                      <button
                        (click)="confirmPayment(res)"
                        class="text-xs text-green-600 hover:text-green-700
                               border border-green-200 px-3 py-1.5 rounded-lg
                               transition-colors">
                        Confirmar pago
                      </button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class ReservationsComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private hotelService       = inject(HotelService);
  private toast              = inject(ToastService);

  hotels          = signal<HotelSummary[]>([]);
  reservations    = signal<Reservation[]>([]);
  loading         = signal(false);
  selectedHotelId = signal<number | null>(null);

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
    this.reservationService.getByHotel(id).subscribe({
      next: res => {
        this.reservations.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  confirmPayment(reservation: Reservation) {
    this.reservationService.confirmPayment(reservation.id).subscribe({
      next: res => {
        this.reservations.update(list =>
          list.map(r => r.id === reservation.id ? res.data : r)
        );
        this.toast.success('Pago confirmado exitosamente');
      },
      error: err => this.toast.error(err.error?.message || 'Error al confirmar')
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