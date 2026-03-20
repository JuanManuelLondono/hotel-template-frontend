import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RoomTypeService, RoomType } from '../../../core/services/room-type.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { CurrencyCopPipe } from '../../../shared/pipes/currency-cop.pipe';

@Component({
  selector: 'app-make-reservation',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule,
            LoadingSpinnerComponent, CurrencyCopPipe],
  template: `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <div class="mb-6">
        <a [routerLink]="['/hotels', roomType()?.hotelId]"
           class="text-gray-400 hover:text-gray-600 text-sm">
          ← Volver al hotel
        </a>
        <h1 class="font-serif text-3xl font-bold text-gray-900 mt-2">
          Crear Reserva
        </h1>
      </div>

      @if (loading()) {
        <app-loading-spinner text="Cargando..." />
      } @else if (!roomType()) {
        <div class="text-center py-16">
          <p class="text-gray-500">Tipo de habitación no encontrado</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

          <!-- Formulario -->
          <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 class="font-semibold text-gray-900 mb-5">Datos de la reserva</h2>

            <form [formGroup]="form" (ngSubmit)="onSubmit()"
                  class="flex flex-col gap-4">

              <!-- Check-in -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de entrada
                </label>
                <input type="date"
                       formControlName="checkIn"
                       [min]="today"
                       class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                              text-sm outline-none focus:border-primary-500
                              transition-colors"
                       [class.border-red-400]="isInvalid('checkIn')"/>
              </div>

              <!-- Check-out -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de salida
                </label>
                <input type="date"
                       formControlName="checkOut"
                       [min]="minCheckOut()"
                       class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                              text-sm outline-none focus:border-primary-500
                              transition-colors"
                       [class.border-red-400]="isInvalid('checkOut')"/>
              </div>

              <!-- Huéspedes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Número de huéspedes
                </label>
                <select formControlName="guestsCount"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                               text-sm outline-none focus:border-primary-500
                               transition-colors bg-white">
                  @for (n of guestOptions(); track n) {
                    <option [value]="n">
                      {{ n }} huésped{{ n !== 1 ? 'es' : '' }}
                    </option>
                  }
                </select>
              </div>

              <!-- Requests especiales -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Peticiones especiales
                  <span class="text-gray-400 font-normal">(opcional)</span>
                </label>
                <textarea formControlName="specialRequests"
                          rows="3"
                          placeholder="Habitación en piso alto, llegada tardía..."
                          class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                                 text-sm outline-none focus:border-primary-500
                                 transition-colors resize-none"></textarea>
              </div>

              <button type="submit"
                      [disabled]="form.invalid || submitting()"
                      class="w-full bg-primary-500 hover:bg-primary-600
                             disabled:bg-gray-300 text-white py-3 rounded-xl
                             font-semibold text-sm transition-colors mt-2">
                {{ submitting() ? 'Creando reserva...' : 'Confirmar Reserva' }}
              </button>
            </form>
          </div>

          <!-- Resumen -->
          <div>
            <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6
                        sticky top-20">
              <h2 class="font-semibold text-gray-900 mb-4">Resumen</h2>

              <!-- Habitación -->
              <div class="flex gap-4 pb-4 border-b border-gray-100">
                <div class="w-16 h-16 bg-gradient-to-br from-secondary-100
                            to-primary-100 rounded-xl flex items-center
                            justify-center flex-shrink-0">
                  @if (roomType()!.coverImageUrl) {
                    <img [src]="roomType()!.coverImageUrl"
                         [alt]="roomType()!.name"
                         class="w-full h-full object-cover rounded-xl"/>
                  } @else {
                    <span class="text-2xl">🛏</span>
                  }
                </div>
                <div>
                  <p class="font-semibold text-gray-900">{{ roomType()!.name }}</p>
                  <p class="text-sm text-gray-500">{{ roomType()!.hotelName }}</p>
                  <p class="text-sm text-primary-600 font-medium mt-1">
                    {{ roomType()!.pricePerNight | currencyCop }}/noche
                  </p>
                </div>
              </div>

              <!-- Desglose de precio -->
              @if (totalNights() > 0) {
                <div class="mt-4 flex flex-col gap-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">
                      {{ roomType()!.pricePerNight | currencyCop }}
                      × {{ totalNights() }} noche{{ totalNights() !== 1 ? 's' : '' }}
                    </span>
                    <span class="text-gray-800">
                      {{ subtotal() | currencyCop }}
                    </span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Impuestos (19%)</span>
                    <span class="text-gray-800">{{ taxes() | currencyCop }}</span>
                  </div>
                  <div class="flex justify-between font-bold text-base pt-2
                              border-t border-gray-100 mt-1">
                    <span class="text-gray-900">Total</span>
                    <span class="text-primary-600">{{ total() | currencyCop }}</span>
                  </div>
                </div>
              } @else {
                <p class="text-sm text-gray-400 text-center py-4 mt-2">
                  Selecciona las fechas para ver el precio total
                </p>
              }

              <!-- Política de cancelación -->
              @if (roomType()!.hotelName) {
                <div class="mt-4 p-3 bg-green-50 rounded-xl">
                  <p class="text-xs text-green-700">
                    ✓ Cancelación gratuita disponible
                  </p>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class MakeReservationComponent implements OnInit {
  private route              = inject(ActivatedRoute);
  private router             = inject(Router);
  private roomTypeService    = inject(RoomTypeService);
  private reservationService = inject(ReservationService);
  private toast              = inject(ToastService);
  private fb                 = inject(FormBuilder);

  roomType   = signal<RoomType | null>(null);
  loading    = signal(true);
  submitting = signal(false);
  today      = new Date().toISOString().split('T')[0];

  form = this.fb.group({
    checkIn:         ['', Validators.required],
    checkOut:        ['', Validators.required],
    guestsCount:     [1, [Validators.required, Validators.min(1)]],
    specialRequests: [''],
  });

  // Computed — se recalculan automáticamente cuando cambian las fechas
  totalNights = computed(() => {
    const checkIn  = this.form.get('checkIn')?.value;
    const checkOut = this.form.get('checkOut')?.value;
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  });

  subtotal = computed(() =>
    (this.roomType()?.pricePerNight ?? 0) * this.totalNights()
  );

  taxes = computed(() => Math.round(this.subtotal() * 0.19));

  total = computed(() => this.subtotal() + this.taxes());

  minCheckOut = computed(() => {
    const checkIn = this.form.get('checkIn')?.value;
    if (!checkIn) return this.today;
    const next = new Date(checkIn);
    next.setDate(next.getDate() + 1);
    return next.toISOString().split('T')[0];
  });

  guestOptions = computed(() => {
    const capacity = this.roomType()?.capacity ?? 1;
    return Array.from({ length: capacity }, (_, i) => i + 1);
  });

  ngOnInit() {
    const roomTypeId = Number(this.route.snapshot.paramMap.get('roomTypeId'));
    this.roomTypeService.findById(roomTypeId).subscribe({
      next: res => {
        this.roomType.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('No se pudo cargar la habitación');
      }
    });

    // Recalcular cuando cambia checkIn
    this.form.get('checkIn')?.valueChanges.subscribe(() => {
      this.form.patchValue({ checkOut: '' });
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onSubmit() {
    if (this.form.invalid || !this.roomType()) return;
    this.submitting.set(true);

    this.reservationService.create({
      roomTypeId:      this.roomType()!.id,
      checkIn:         this.form.value.checkIn!,
      checkOut:        this.form.value.checkOut!,
      guestsCount:     Number(this.form.value.guestsCount),
      specialRequests: this.form.value.specialRequests || undefined,
    }).subscribe({
      next: res => {
        this.toast.success(`¡Reserva creada! Código: ${res.data.reservationCode}`);
        this.router.navigate(['/guest/reservations']);
      },
      error: err => {
        this.toast.error(err.error?.message || 'Error al crear la reserva');
        this.submitting.set(false);
      }
    });
  }
}