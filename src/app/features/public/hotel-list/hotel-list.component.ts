import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelService } from '../../../core/services/hotel.service';
import { HotelSummary } from '../../../core/models/hotel.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { CurrencyCopPipe } from '../../../shared/pipes/currency-cop.pipe';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LoadingSpinnerComponent,
            StarRatingComponent, CurrencyCopPipe],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="font-serif text-3xl font-bold text-gray-900">
          {{ searchCity() ? 'Hoteles en ' + searchCity() : 'Todos los hoteles' }}
        </h1>
        <p class="text-gray-500 mt-1">
          {{ hotels().length }} hotel{{ hotels().length !== 1 ? 'es' : '' }} encontrado{{ hotels().length !== 1 ? 's' : '' }}
        </p>
      </div>

      <!-- Búsqueda -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8
                  flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          [(ngModel)]="searchInput"
          placeholder="Buscar por ciudad..."
          (keydown.enter)="search()"
          class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                 outline-none focus:border-primary-500 transition-colors"/>
        <button
          (click)="search()"
          class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5
                 rounded-xl text-sm font-semibold transition-colors">
          Buscar
        </button>
        @if (searchCity()) {
          <button
            (click)="clearSearch()"
            class="border border-gray-200 hover:bg-gray-50 text-gray-600 px-4
                   py-2.5 rounded-xl text-sm transition-colors">
            Limpiar
          </button>
        }
      </div>

      @if (loading()) {
        <app-loading-spinner text="Buscando hoteles..." />
      } @else if (hotels().length === 0) {
        <div class="text-center py-16">
          <span class="text-5xl">🔍</span>
          <p class="text-gray-500 mt-4 text-lg">No se encontraron hoteles</p>
          <button (click)="clearSearch()"
                  class="mt-4 text-primary-600 hover:text-primary-700 font-medium">
            Ver todos los hoteles
          </button>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (hotel of hotels(); track hotel.id) {
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
    </div>
  `
})
export class HotelListComponent implements OnInit {
  private hotelService = inject(HotelService);
  private route        = inject(ActivatedRoute);

  hotels      = signal<HotelSummary[]>([]);
  loading     = signal(true);
  searchCity  = signal('');
  searchInput = '';

  ngOnInit() {
    // Leer ciudad de query params si viene del buscador del home
    this.route.queryParams.subscribe(params => {
      if (params['city']) {
        this.searchCity.set(params['city']);
        this.searchInput = params['city'];
        this.loadByCity(params['city']);
      } else {
        this.loadAll();
      }
    });
  }

  search() {
    if (this.searchInput.trim()) {
      this.searchCity.set(this.searchInput.trim());
      this.loadByCity(this.searchInput.trim());
    } else {
      this.clearSearch();
    }
  }

  clearSearch() {
    this.searchCity.set('');
    this.searchInput = '';
    this.loadAll();
  }

  private loadAll() {
    this.loading.set(true);
    this.hotelService.findAll().subscribe({
      next: res => {
        this.hotels.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private loadByCity(city: string) {
    this.loading.set(true);
    this.hotelService.findByCity(city).subscribe({
      next: res => {
        this.hotels.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}