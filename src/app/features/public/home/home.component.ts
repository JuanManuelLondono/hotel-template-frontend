import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelService } from '../../../core/services/hotel.service';
import { HotelSummary } from '../../../core/models/hotel.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { CurrencyCopPipe } from '../../../shared/pipes/currency-cop.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule,
            LoadingSpinnerComponent,  CurrencyCopPipe],
  template: `
    <!-- Hero fullscreen -->
    <section class="relative h-screen w-full flex items-center justify-center
                    overflow-hidden -mt-16">

      <!-- Imagen de fondo -->
      <div class="absolute inset-0 z-0">
        <img
          src="https://res.cloudinary.com/dwxgnsz6f/image/upload/pexels-pixabay-271624_bx7idl"
          alt="Hotel room"
          class="w-full h-full object-cover"/>
        <div class="absolute inset-0 bg-primary/60"></div>
      </div>

      <!-- Contenido hero -->
      <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p class="font-body text-xs uppercase tracking-[0.3em] text-gold mb-6 font-bold">
          Bienvenido a HotelTemplate
        </p>
        <h1 class="font-headline text-5xl md:text-7xl font-extrabold text-white
                   mb-8 tracking-tight leading-tight">
          Tu estadía perfecta
          <span class="text-gold block pl-8">te espera</span>
        </h1>
        <p class="font-body text-lg md:text-xl text-white/80 mb-12 max-w-2xl
                  mx-auto font-light leading-relaxed">
          Experiencias de lujo diseñadas para superar cada expectativa.
          Confort, elegancia y servicio sin igual.
        </p>

        <!-- Buscador -->
        <div class="bg-white/95 backdrop-blur-sm rounded-xl p-2 flex flex-col
                    sm:flex-row gap-2 max-w-2xl mx-auto shadow-2xl shadow-primary/30">
          <div class="flex items-center gap-3 flex-1 bg-primary-50 px-4 py-3
                      rounded-lg border border-primary-100">
            <!-- SVG pin -->
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                 viewBox="0 0 24 24" class="text-primary-400 flex-shrink-0">
              <g fill="none" stroke="currentColor" stroke-linecap="round"
                 stroke-linejoin="round" stroke-width="2">
                <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0-6 0"/>
                <path d="M12.783 21.326a2 2 0 0 1-2.196-.426l-4.244-4.243A8 8 0 1 1 20 11.037"/>
                <path d="M21.121 20.121a3 3 0 1 0-4.242 0Q17.506 20.749 19 22q1.577-1.335 2.121-1.879M19 18v.01"/>
              </g>
            </svg>
            <input
              type="text"
              placeholder="¿A qué ciudad vas?"
              [(ngModel)]="searchCity"
              (keydown.enter)="search()"
              class="bg-transparent border-none p-0 text-primary text-sm
                     outline-none w-full placeholder-primary-300 focus:ring-0"/>
          </div>
          <button
            (click)="search()"
            class="bg-primary hover:bg-primary-800 text-white px-8 py-3
                   rounded-lg font-headline font-semibold text-sm tracking-wide
                   transition-all active:scale-95">
            Buscar
          </button>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40
                  animate-bounce flex flex-col items-center gap-1">
        <span class="text-xs uppercase tracking-widest text-white/30">Descubre</span>
        <span class="text-2xl">↓</span>
      </div>
    </section>

    <!-- Hoteles mejor calificados -->
    <section class="py-24 px-8 max-w-7xl mx-auto">
      <div class="flex flex-col items-center mb-16 text-center">
        <span class="font-body text-xs uppercase tracking-[0.3em] text-secondary
                     font-bold mb-4">
          Los favoritos
        </span>
        <h2 class="font-headline text-4xl md:text-5xl font-bold text-primary mb-6">
          Mejor Calificados
        </h2>
        <div class="gold-divider"></div>
      </div>

      @if (loading()) {
        <app-loading-spinner text="Cargando hoteles..." />
      } @else if (topRated().length === 0) {
        <div class="text-center py-12">
          <span class="text-4xl">🏨</span>
          <p class="text-primary-300 mt-4">No hay hoteles disponibles aún</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          @for (hotel of topRated(); track hotel.id) {
            <a [routerLink]="['/hotels', hotel.id]" class="group cursor-pointer">

              <!-- Imagen -->
              <div class="overflow-hidden rounded-xl mb-6 relative aspect-[4/5]
                          bg-gradient-to-br from-primary-200 to-primary-300">
                @if (hotel.coverImageUrl) {
                  <img [src]="hotel.coverImageUrl"
                       [alt]="hotel.name"
                       class="w-full h-full object-cover group-hover:scale-110
                              transition-transform duration-700"/>
                } @else {
                  <div class="w-full h-full flex items-center justify-center">
                    <span class="text-6xl opacity-20">🏨</span>
                  </div>
                }
                <div class="absolute inset-0 bg-gradient-to-t from-primary/70
                            to-transparent opacity-0 group-hover:opacity-100
                            transition-opacity duration-500"></div>

                <!-- Rating badge -->
                <div class="absolute top-4 right-4 bg-white/95 backdrop-blur-sm
                            rounded px-2.5 py-1.5 flex items-center gap-1.5">
                  <span class="text-gold text-sm">★</span>
                  <span class="text-xs font-bold text-primary">
                    {{ hotel.averageRating | number:'1.1-1' }}
                  </span>
                </div>
              </div>

              <!-- Info -->
              <h3 class="font-headline text-2xl font-bold text-primary mb-2
                         group-hover:text-secondary transition-colors">
                {{ hotel.name }}
              </h3>
              <p class="text-primary-400 text-sm mb-3 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                     viewBox="0 0 24 24" class="flex-shrink-0">
                  <g fill="none" stroke="currentColor" stroke-linecap="round"
                     stroke-linejoin="round" stroke-width="2">
                    <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0-6 0"/>
                    <path d="M17.657 16.657L13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/>
                  </g>
                </svg>
                {{ hotel.city }}, {{ hotel.country }}
              </p>
              <div class="flex justify-between items-center">
                <p class="text-xs text-primary-300">
                  {{ hotel.totalReviews }} reseña{{ hotel.totalReviews !== 1 ? 's' : '' }}
                </p>
                @if (hotel.minPrice) {
                  <p class="text-sm font-semibold text-secondary">
                    desde {{ hotel.minPrice | currencyCop }}
                  </p>
                }
              </div>
            </a>
          }
        </div>

        <div class="text-center mt-12">
          <a routerLink="/hotels"
             class="inline-flex items-center gap-2 border border-primary text-primary
                    px-8 py-3 rounded font-headline font-semibold text-sm
                    tracking-wide hover:bg-primary hover:text-white
                    transition-all duration-300">
            Ver todos los hoteles →
          </a>
        </div>
      }
    </section>

    <!-- Features -->
    <section class="bg-primary py-24 px-8 relative overflow-hidden">
      <div class="absolute top-0 right-0 p-16 opacity-5 text-white text-[200px]
                  font-headline font-bold select-none">
        ✦
      </div>

      <div class="max-w-7xl mx-auto relative z-10">
        <div class="flex flex-col items-center mb-16 text-center">
          <span class="font-body text-xs uppercase tracking-[0.3em] text-gold
                       font-bold mb-4">
            Nuestro compromiso
          </span>
          <h2 class="font-headline text-4xl md:text-5xl font-bold text-white mb-6">
            La Excelencia como Estándar
          </h2>
          <div class="gold-divider"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          @for (feature of features; track feature.title) {
            <div class="flex gap-5">
              <div class="w-14 h-14 bg-white/5 border border-white/10 rounded-xl
                          flex items-center justify-center flex-shrink-0">
                <span class="text-2xl">{{ feature.icon }}</span>
              </div>
              <div>
                <h3 class="font-headline font-bold text-white mb-2 text-lg">
                  {{ feature.title }}
                </h3>
                <p class="text-white/60 text-sm leading-relaxed font-light">
                  {{ feature.description }}
                </p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Testimonial -->
    <section class="py-24 px-8 bg-surface-dim/30">
      <div class="max-w-4xl mx-auto text-center">
        <div class="flex justify-center gap-1 text-gold mb-8">
          @for (star of [1,2,3,4,5]; track star) {
            <span class="text-xl">★</span>
          }
        </div>
        <blockquote class="font-headline text-2xl md:text-4xl text-primary
                           font-medium italic mb-10 leading-tight">
          "La atención al detalle es impresionante. Cada aspecto de la estadía
          fue perfecto. Sin duda el mejor hotel en el que he estado."
        </blockquote>
        <div class="flex items-center justify-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-primary-200 flex items-center
                      justify-center text-primary font-bold text-xl
                      ring-2 ring-gold ring-offset-4">
            M
          </div>
          <div class="text-left">
            <p class="font-headline font-bold text-primary text-lg">María Gómez</p>
            <p class="text-primary-400 text-xs uppercase tracking-widest">
              Huésped frecuente
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="bg-primary-900 py-20 px-8 text-center">
      <p class="font-body text-xs uppercase tracking-[0.3em] text-gold font-bold mb-4">
        ¿Listo para comenzar?
      </p>
      <h2 class="font-headline text-4xl font-bold text-white mb-6">
        Reserva tu estadía perfecta hoy
      </h2>
      <a routerLink="/hotels"
         class="inline-block bg-secondary-container text-primary px-10 py-4
                rounded-lg font-headline font-bold text-lg hover:shadow-xl
                hover:shadow-secondary/20 transition-all active:scale-95">
        Ver disponibilidad
      </a>
    </section>
  `
})
export class HomeComponent implements OnInit {
  private hotelService = inject(HotelService);

  topRated   = signal<HotelSummary[]>([]);
  loading    = signal(true);
  searchCity = '';

  features = [
    {
      icon: '🔒',
      title: 'Reservas Seguras',
      description: 'Tu información y pagos protegidos con los más altos estándares de seguridad internacional.'
    },
    {
      icon: '⭐',
      title: 'Hoteles Verificados',
      description: 'Cada propiedad es cuidadosamente seleccionada y verificada por nuestro equipo de expertos.'
    },
    {
      icon: '💬',
      title: 'Soporte 24/7',
      description: 'Nuestro equipo está disponible en todo momento para garantizar una experiencia perfecta.'
    }
  ];

  ngOnInit() {
    this.hotelService.findTopRated().subscribe({
      next: res => {
        this.topRated.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  search() {
    if (this.searchCity.trim()) {
      window.location.href = `/hotels?city=${encodeURIComponent(this.searchCity)}`;
    }
  }
}