import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../../core/services/hotel.service';
import { HotelSummary } from '../../../core/models/hotel.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { CurrencyCopPipe } from '../../../shared/pipes/currency-cop.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule, LoadingSpinnerComponent, StarRatingComponent, CurrencyCopPipe],
  template: `
    <!-- Hero -->
    <section class="relative bg-gradient-to-br from-secondary-900 via-secondary-800
                    to-primary-900 text-white py-24 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="font-serif text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Tu estadía perfecta
          <span class="text-primary-400"> te espera</span>
        </h1>
        <p class="text-secondary-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Descubre hoteles de lujo con el mejor servicio. Reserva fácil, vive
          experiencias inolvidables.
        </p>

        <!-- Buscador -->
        <div class="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2
                    max-w-2xl mx-auto shadow-xl">
          <input
            type="text"
            placeholder="¿A qué ciudad vas?"
            [(ngModel)]="searchCity"
            (keydown.enter)="search()"
            class="flex-1 px-4 py-3 text-gray-800 rounded-xl outline-none
                   placeholder-gray-400 text-sm"/>
          <button
            (click)="search()"
            class="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3
                   rounded-xl font-semibold transition-colors text-sm">
            Buscar
          </button>
        </div>
      </div>

      <!-- Decoración -->
      <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t
                  from-gray-50 to-transparent"></div>
    </section>

    <!-- Hoteles mejor calificados -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="flex justify-between items-end mb-8">
        <div>
          <h2 class="font-serif text-3xl font-bold text-gray-900">
            Mejor calificados
          </h2>
          <p class="text-gray-500 mt-1">Los favoritos de nuestros huéspedes</p>
        </div>
        <a routerLink="/hotels"
           class="text-primary-600 hover:text-primary-700 font-medium text-sm
                  transition-colors">
          Ver todos →
        </a>
      </div>

      @if (loading()) {
        <app-loading-spinner text="Cargando hoteles..." />
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (hotel of topRated(); track hotel.id) {
            <a [routerLink]="['/hotels', hotel.id]"
               class="group bg-white rounded-2xl shadow-sm hover:shadow-lg
                      transition-all duration-300 overflow-hidden border
                      border-gray-100">

              <!-- Imagen -->
              <div class="aspect-video bg-gradient-to-br from-secondary-200
                          to-primary-200 overflow-hidden relative">
                @if (hotel.coverImageUrl) {
                  <img [src]="hotel.coverImageUrl"
                       [alt]="hotel.name"
                       class="w-full h-full object-cover group-hover:scale-105
                              transition-transform duration-300"/>
                } @else {
                  <div class="w-full h-full flex items-center justify-center">
                    <span class="text-5xl">🏨</span>
                  </div>
                }
                <!-- Badge rating -->
                <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm
                            rounded-full px-2.5 py-1 flex items-center gap-1">
                  <span class="text-amber-400 text-sm">★</span>
                  <span class="text-xs font-bold text-gray-800">
                    {{ hotel.averageRating | number:'1.1-1' }}
                  </span>
                </div>
              </div>

              <!-- Info -->
              <div class="p-5">
                <h3 class="font-serif text-lg font-bold text-gray-900
                           group-hover:text-primary-600 transition-colors">
                  {{ hotel.name }}
                </h3>
                <p class="text-gray-500 text-sm mt-1">
                  📍 {{ hotel.city }}, {{ hotel.country }}
                </p>
                <div class="flex justify-between items-center mt-4">
                  <div>
                    <app-star-rating [rating]="hotel.averageRating"
                                     [readonly]="true" />
                    <p class="text-xs text-gray-400 mt-0.5">
                      {{ hotel.totalReviews }} reseñas
                    </p>
                  </div>
                  @if (hotel.minPrice) {
                    <div class="text-right">
                      <p class="text-xs text-gray-400">desde</p>
                      <p class="font-bold text-primary-600">
                        {{ hotel.minPrice | currencyCop }}
                      </p>
                    </div>
                  }
                </div>
              </div>
            </a>
          }
        </div>
      }
    </section>

    <!-- Features -->
    <section class="bg-gray-50 py-16 px-4">
      <div class="max-w-7xl mx-auto">
        <h2 class="font-serif text-3xl font-bold text-center text-gray-900 mb-12">
          ¿Por qué elegirnos?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          @for (feature of features; track feature.icon) {
            <div class="bg-white rounded-2xl p-8 text-center shadow-sm
                        border border-gray-100">
              <div class="text-4xl mb-4">{{ feature.icon }}</div>
              <h3 class="font-semibold text-lg text-gray-900 mb-2">
                {{ feature.title }}
              </h3>
              <p class="text-gray-500 text-sm leading-relaxed">
                {{ feature.description }}
              </p>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  private hotelService = inject(HotelService);

  topRated = signal<HotelSummary[]>([]);
  loading  = signal(true);
  searchCity = '';

  features = [
    {
      icon: '🔒',
      title: 'Reservas seguras',
      description: 'Tu información y pagos están protegidos con los más altos estándares de seguridad.'
    },
    {
      icon: '⭐',
      title: 'Hoteles verificados',
      description: 'Todos nuestros hoteles son cuidadosamente seleccionados y verificados.'
    },
    {
      icon: '💬',
      title: 'Soporte 24/7',
      description: 'Nuestro equipo está disponible las 24 horas para ayudarte.'
    }
  ];

  ngOnInit() {
  this.hotelService.findTopRated().subscribe({
    next: res => {
      this.topRated.set(res.data);
      this.loading.set(false);
    },
    error: () => {
      this.loading.set(false);
    }
  });
}

  search() {
    if (this.searchCity.trim()) {
      window.location.href = `/hotels?city=${this.searchCity}`;
    }
  }
}