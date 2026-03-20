import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HotelService } from '../../../core/services/hotel.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { CurrencyCopPipe } from '../../../shared/pipes/currency-cop.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, CurrencyCopPipe],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="font-serif text-3xl font-bold text-gray-900">
          Panel de Administración
        </h1>
        <p class="text-gray-500 mt-1">Bienvenido al panel de control</p>
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        @for (stat of stats(); track stat.label) {
          <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm text-gray-500">{{ stat.label }}</p>
                <p class="font-bold text-2xl text-gray-900 mt-1">
                  {{ stat.value }}
                </p>
              </div>
              <span class="text-3xl">{{ stat.icon }}</span>
            </div>
          </div>
        }
      </div>

      <!-- Accesos rápidos -->
      <h2 class="font-serif text-xl font-bold text-gray-900 mb-4">
        Gestión
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        @for (action of actions; track action.label) {
          <a [routerLink]="action.route"
             class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6
                    hover:shadow-md transition-shadow group">
            <span class="text-3xl">{{ action.icon }}</span>
            <h3 class="font-semibold text-gray-900 mt-3 group-hover:text-primary-600
                       transition-colors">
              {{ action.label }}
            </h3>
            <p class="text-sm text-gray-400 mt-1">{{ action.description }}</p>
          </a>
        }
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private hotelService = inject(HotelService);

  stats = signal([
    { label: 'Hoteles activos', value: '—', icon: '🏨' },
    { label: 'Reservas totales', value: '—', icon: '📋' },
    { label: 'Huéspedes', value: '—', icon: '👤' },
    { label: 'Reseñas', value: '—', icon: '⭐' },
  ]);

  actions = [
    {
      route: '/admin/hotels',
      icon: '🏨',
      label: 'Hoteles',
      description: 'Gestionar hoteles y habitaciones'
    },
    {
      route: '/admin/reservations',
      icon: '📋',
      label: 'Reservas',
      description: 'Ver y gestionar reservas'
    },
    {
      route: '/admin/reviews',
      icon: '⭐',
      label: 'Reseñas',
      description: 'Moderar reseñas de huéspedes'
    },
    {
      route: '/admin/room-types',
      icon: '🛏',
      label: 'Habitaciones',
      description: 'Gestionar tipos de habitación'
    },
    {
      route: '/admin/gallery',
      icon: '🖼',
      label: 'Galería',
      description: 'Gestionar imágenes del hotel'
    },
  ];

  ngOnInit() {
    this.hotelService.findAll().subscribe({
      next: res => {
        this.stats.update(stats => stats.map(s =>
          s.label === 'Hoteles activos'
            ? { ...s, value: String(res.data.length) }
            : s
        ));
      }
    });
  }
}