import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../../core/services/hotel.service';
import { ReviewService } from '../../../core/services/review.service';
import { GalleryService, GalleryImage } from '../../../core/services/gallery.service';
import { RoomTypeService, RoomType } from '../../../core/services/room-type.service';
import { AuthService } from '../../../core/services/auth.service';
import { Hotel } from '../../../core/models/hotel.model';
import { Review, ReviewRequest } from '../../../core/models/review.model';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { CurrencyCopPipe } from '../../../shared/pipes/currency-cop.pipe';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent,
            StarRatingComponent, CurrencyCopPipe, ReactiveFormsModule],
  template: `
    @if (loading()) {
      <app-loading-spinner [fullScreen]="true" text="Cargando hotel..." />
    } @else if (!hotel()) {
      <div class="text-center py-24">
        <span class="text-5xl"></span>
        <p class="text-gray-500 mt-4 text-lg">Hotel no encontrado</p>
        <a routerLink="/hotels"
           class="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium">
          ← Volver a hoteles
        </a>
      </div>
    } @else {

      <!-- Hero imagen -->
      <div class="relative h-72 md:h-96 bg-gradient-to-br from-secondary-800
                  to-primary-800 overflow-hidden">
        @if (hotel()!.coverImageUrl) {
          <img [src]="hotel()!.coverImageUrl"
               [alt]="hotel()!.name"
               class="w-full h-full object-cover"/>
          <div class="absolute inset-0 bg-black/40"></div>
        }
        <div class="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
          <div class="max-w-7xl mx-auto w-full">
            <a routerLink="/hotels"
               class="text-white/80 hover:text-white text-sm mb-3 inline-block">
              ← Volver
            </a>
            <h1 class="font-serif text-3xl md:text-5xl font-bold text-white">
              {{ hotel()!.name }}
            </h1>
            <div class="flex items-center gap-4 mt-2">
              <p class="text-white/80 text-sm">
                {{ hotel()!.city }}, {{ hotel()!.country }}
              </p>
              <div class="flex items-center gap-1">
                <span class="text-amber-400">★</span>
                <span class="text-white font-bold">
                  {{ hotel()!.averageRating | number:'1.1-1' }}
                </span>
                <span class="text-white/60 text-sm">
                  ({{ hotel()!.totalReviews }} reseñas)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">

          <!-- Columna principal -->
          <div class="lg:col-span-2 flex flex-col gap-10">

            <!-- Descripción -->
            <section>
              <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">
                Sobre el hotel
              </h2>
              <p class="text-gray-600 leading-relaxed">
                {{ hotel()!.description }}
              </p>

              <!-- Info rápida -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                @if (hotel()!.checkInTime) {
                  <div class="bg-gray-50 rounded-xl p-4 text-center">
                    <div class="flex justify-center text-2xl">
                      <svg xmlns="http://www.w3.org/2000/svg" 
                          width="24" height="24" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M17 3.34A10 10 0 1 1 2 12l.005-.324A10 10 0 0 1 17 3.34M12 6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h3.5a1 1 0 0 0 0-2H13V7a1 1 0 0 0-.883-.993z"/>
                      </svg>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Check-in</p>
                    <p class="font-semibold text-sm text-gray-800">
                      {{ hotel()!.checkInTime }}
                    </p>
                  </div>
                }
                @if (hotel()!.checkOutTime) {
                  <div class="bg-gray-50 rounded-xl p-4 text-center">
                    <div class="flex justify-center text-2xl">
                      <svg xmlns="http://www.w3.org/2000/svg" 
                          width="24" height="24" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M17 3.34A10 10 0 1 1 2 12l.005-.324A10 10 0 0 1 17 3.34m-5.401 9.576l.052.021l.08.026l.08.019l.072.011L12 13l.076-.003l.135-.02l.082-.02l.103-.039l.073-.035l.078-.046l.06-.042l.08-.069l.083-.088l.062-.083l2-3a1 1 0 1 0-1.664-1.11L13 8.696V7a1 1 0 0 0-.883-.993L12 6a1 1 0 0 0-1 1v5.026l.009.105l.02.107l.04.129l.048.102l.046.078l.042.06l.069.08l.088.083l.083.062l.09.053z"/>
                      </svg>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Check-out</p>
                    <p class="font-semibold text-sm text-gray-800">
                      {{ hotel()!.checkOutTime }}
                    </p>
                  </div>
                }
                @if (hotel()!.phone) {
                  <div class="bg-gray-50 rounded-xl p-4 text-center">
                    <div class="flex justify-center text-2xl">
                      <svg xmlns="http://www.w3.org/2000/svg" 
                          width="24" height="24" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25c1.12.37 2.32.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"/>
                    </svg>

                    </div>
                    <p class="text-xs text-gray-500 mt-1">Teléfono</p>
                    <p class="font-semibold text-sm text-gray-800">
                      {{ hotel()!.phone }}
                    </p>
                  </div>
                }
                @if (hotel()!.address) {
                  <div class="bg-gray-50 rounded-xl p-4 text-center">
                    <div class= "flex justify-center text-2xl">
                      <svg xmlns="http://www.w3.org/2000/svg" 
                          width="24" height="24" viewBox="0 0 24 24">
                          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0-6 0"/>
                          <path d="M12.783 21.326a2 2 0 0 1-2.196-.426l-4.244-4.243A8 8 0 1 1 20 11.037"/>
                          <path d="M21.121 20.121a3 3 0 1 0-4.242 0Q17.506 20.749 19 22q1.577-1.335 2.121-1.879M19 18v.01"/></g>
                      </svg>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Dirección</p>
                    <p class="font-semibold text-sm text-gray-800 truncate">
                      {{ hotel()!.address }}
                    </p>
                  </div>
                }
              </div>
            </section>

            <!-- Tipos de habitación -->
            <section>
              <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">
                Habitaciones disponibles
              </h2>

              @if (loadingRooms()) {
                <app-loading-spinner text="Cargando habitaciones..." />
              } @else {
                <div class="flex flex-col gap-4">
                  @for (room of roomTypes(); track room.id) {
                    <div class="border border-gray-100 rounded-2xl overflow-hidden
                                hover:shadow-md transition-shadow">
                      <div class="flex flex-col sm:flex-row">

                        <!-- Imagen habitación -->
                        <div class="sm:w-48 h-36 sm:h-auto bg-gradient-to-br
                                    from-secondary-100 to-primary-100 flex-shrink-0
                                    flex items-center justify-center">
                          @if (room.coverImageUrl) {
                            <img [src]="room.coverImageUrl"
                                 [alt]="room.name"
                                 class="w-full h-full object-cover"/>
                          } @else {
                            <span class="text-4xl">🛏</span>
                          }
                        </div>

                        <!-- Info habitación -->
                        <div class="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div class="flex justify-between items-start">
                              <h3 class="font-semibold text-lg text-gray-900">
                                {{ room.name }}
                              </h3>
                              <span class="text-xs px-2 py-1 rounded-full font-medium"
                                    [class]="room.availableRooms > 0
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-red-100 text-red-700'">
                                {{ room.availableRooms > 0
                                  ? room.availableRooms + ' disponibles'
                                  : 'Agotado' }}
                              </span>
                            </div>
                            <p class="text-gray-500 text-sm mt-1 line-clamp-2">
                              {{ room.description }}
                            </p>

                            <!-- Amenities -->
                            @if (room.amenities.length) {
                              <div class="flex flex-wrap gap-2 mt-3">
                                @for (amenity of room.amenities.slice(0, 4);
                                      track amenity.id) {
                                  <span class="text-xs bg-gray-100 text-gray-600
                                               px-2 py-1 rounded-full">
                                    {{ amenity.name }}
                                  </span>
                                }
                                @if (room.amenities.length > 4) {
                                  <span class="text-xs text-gray-400">
                                    +{{ room.amenities.length - 4 }} más
                                  </span>
                                }
                              </div>
                            }
                          </div>

                          <div class="flex justify-between items-center mt-4">
                            <div>
                              <p class="text-xs text-gray-400">Por noche</p>
                              <p class="font-bold text-xl text-primary-600">
                                {{ room.pricePerNight | currencyCop }}
                              </p>
                              <p class="text-xs text-gray-400">
                                👤 Capacidad: {{ room.capacity }} personas
                              </p>
                            </div>
                            @if (room.availableRooms > 0) {
                              <a [routerLink]="['/guest/reserve', room.id]"
                                 class="bg-primary-500 hover:bg-primary-600 text-white
                                        px-5 py-2.5 rounded-xl text-sm font-semibold
                                        transition-colors">
                                Reservar
                              </a>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }
            </section>

            <!-- Galería -->
            @if (gallery().length > 0) {
              <section>
                <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">
                  Galería
                </h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  @for (image of gallery().slice(0, 6); track image.id) {
                    <div class="aspect-square rounded-xl overflow-hidden bg-gray-100">
                      <img [src]="image.imageUrl"
                           [alt]="image.altText || hotel()!.name"
                           class="w-full h-full object-cover hover:scale-105
                                  transition-transform duration-300 cursor-pointer"/>
                    </div>
                  }
                </div>
              </section>
            }

            <!-- Reseñas -->
            <section>
              <div class="flex justify-between items-center mb-6">
                <h2 class="font-serif text-2xl font-bold text-gray-900">
                  Reseñas
                </h2>
                <div class="flex items-center gap-2">
                  <span class="text-amber-400 text-xl">★</span>
                  <span class="font-bold text-xl text-gray-900">
                    {{ hotel()!.averageRating | number:'1.1-1' }}
                  </span>
                  <span class="text-gray-400 text-sm">
                    · {{ hotel()!.totalReviews }} reseñas
                  </span>
                </div>
              </div>

              <!-- Formulario de reseña -->
              @if (auth.isLoggedIn() && !userHasReview()) {
                <div class="bg-gray-50 rounded-2xl p-6 mb-6">
                  <h3 class="font-semibold text-gray-900 mb-4">
                    Deja tu reseña
                  </h3>
                  <form [formGroup]="reviewForm"
                        (ngSubmit)="submitReview()"
                        class="flex flex-col gap-4">
                    <div>
                      <label class="text-sm text-gray-600 mb-2 block">
                        Calificación general
                      </label>
                      <app-star-rating
                        [rating]="reviewForm.get('rating')!.value ?? 0"
                        (ratingChange)="reviewForm.patchValue({rating: $event})" />
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-700 mb-1 block">
                        Título
                      </label>
                      <input type="text"
                             formControlName="title"
                             placeholder="Resumen de tu experiencia"
                             class="w-full px-4 py-2.5 border border-gray-200
                                    rounded-xl text-sm outline-none
                                    focus:border-primary-500 transition-colors"/>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-700 mb-1 block">
                        Comentario
                      </label>
                      <textarea formControlName="comment"
                                rows="4"
                                placeholder="Cuéntanos tu experiencia..."
                                class="w-full px-4 py-2.5 border border-gray-200
                                       rounded-xl text-sm outline-none
                                       focus:border-primary-500 transition-colors
                                       resize-none"></textarea>
                    </div>
                    <button type="submit"
                            [disabled]="reviewForm.invalid || submittingReview()"
                            class="bg-primary-500 hover:bg-primary-600
                                   disabled:bg-gray-300 text-white py-2.5
                                   rounded-xl text-sm font-semibold
                                   transition-colors self-start px-6">
                      {{ submittingReview() ? 'Enviando...' : 'Publicar reseña' }}
                    </button>
                  </form>
                </div>
              }

              <!-- Lista de reseñas -->
              @if (loadingReviews()) {
                <app-loading-spinner text="Cargando reseñas..." />
              } @else if (reviews().length === 0) {
                <div class="text-center py-8 text-gray-400">
                  <span class="text-3xl">💬</span>
                  <p class="mt-2">Aún no hay reseñas para este hotel</p>
                </div>
              } @else {
                <div class="flex flex-col gap-4">
                  @for (review of reviews(); track review.id) {
                    <div class="border border-gray-100 rounded-2xl p-5">
                      <div class="flex justify-between items-start">
                        <div class="flex items-center gap-3">
                          <div class="w-9 h-9 bg-primary-100 rounded-full flex
                                      items-center justify-center text-primary-600
                                      font-bold text-sm">
                            {{ review.userName.charAt(0).toUpperCase() }}
                          </div>
                          <div>
                            <p class="font-semibold text-sm text-gray-900">
                              {{ review.userName }}
                            </p>
                            <div class="flex items-center gap-2">
                              <app-star-rating [rating]="review.rating"
                                               [readonly]="true" />
                              @if (review.verifiedStay) {
                                <span class="text-xs text-green-600 font-medium">
                                  ✓ Estadía verificada
                                </span>
                              }
                            </div>
                          </div>
                        </div>
                        <p class="text-xs text-gray-400">
                          {{ review.createdAt | date:'mediumDate' }}
                        </p>
                      </div>

                      @if (review.title) {
                        <p class="font-semibold text-gray-900 mt-3">
                          {{ review.title }}
                        </p>
                      }
                      <p class="text-gray-600 text-sm mt-1 leading-relaxed">
                        {{ review.comment }}
                      </p>

                      @if (review.hotelResponse) {
                        <div class="bg-primary-50 rounded-xl p-4 mt-3 border-l-4
                                    border-primary-400">
                          <p class="text-xs font-semibold text-primary-700 mb-1">
                            Respuesta del hotel
                          </p>
                          <p class="text-sm text-gray-700">
                            {{ review.hotelResponse }}
                          </p>
                        </div>
                      }
                    </div>
                  }
                </div>
              }
            </section>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="sticky top-20">

              <!-- Card reserva rápida -->
              <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                <h3 class="font-serif text-xl font-bold text-gray-900 mb-4">
                  Reservar ahora
                </h3>

                @if (roomTypes().length > 0) {
                  <div class="flex flex-col gap-3">
                    @for (room of roomTypes().slice(0, 3); track room.id) {
                      <div class="flex justify-between items-center py-2 border-b
                                  border-gray-50 last:border-0">
                        <div>
                          <p class="text-sm font-medium text-gray-800">
                            {{ room.name }}
                          </p>
                          <p class="text-xs text-gray-400">
                            👤 {{ room.capacity }} personas
                          </p>
                        </div>
                        <div class="text-right">
                          <p class="font-bold text-primary-600 text-sm">
                            {{ room.pricePerNight | currencyCop }}
                          </p>
                          <p class="text-xs text-gray-400">/noche</p>
                        </div>
                      </div>
                    }
                  </div>

                  @if (!auth.isLoggedIn()) {
                    <a routerLink="/auth/login"
                       class="block w-full bg-primary-500 hover:bg-primary-600
                              text-white text-center py-3 rounded-xl font-semibold
                              text-sm transition-colors mt-4">
                      Iniciar sesión para reservar
                    </a>
                  }
                } @else {
                  <p class="text-gray-400 text-sm text-center py-4">
                    No hay habitaciones disponibles
                  </p>
                }

                <!-- Info adicional -->
                @if (hotel()!.cancellationPolicy) {
                  <div class="mt-4 p-3 bg-green-50 rounded-xl">
                    <p class="text-xs text-green-700">
                      ✓ {{ hotel()!.cancellationPolicy }}
                    </p>
                  </div>
                }
              </div>

              <!-- Contacto -->
              @if (hotel()!.phone || hotel()!.email) {
                <div class="bg-white border border-gray-100 rounded-2xl shadow-sm
                            p-6 mt-4">
                  <h3 class="font-semibold text-gray-900 mb-3">Contacto</h3>
                  @if (hotel()!.phone) {
                    <p class="text-sm text-gray-600 flex items-center gap-2 mb-2">
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25c1.12.37 2.32.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"/>
                          </svg>
                        </span> {{ hotel()!.phone }}
                    </p>
                  }
                  @if (hotel()!.email) {
                    <p class="text-sm text-gray-600 flex items-center gap-2">
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" d="m20 8l-8 5l-8-5V6l8 5l8-5m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2"/>
                          </svg>
                        </span> {{ hotel()!.email }}
                    </p>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class HotelDetailComponent implements OnInit {
  private route         = inject(ActivatedRoute);
  private hotelService  = inject(HotelService);
  private reviewService = inject(ReviewService);
  private galleryService = inject(GalleryService);
  private roomTypeService = inject(RoomTypeService);
  private toast         = inject(ToastService);
  private fb            = inject(FormBuilder);
  auth                  = inject(AuthService);

  hotel         = signal<Hotel | null>(null);
  reviews       = signal<Review[]>([]);
  gallery       = signal<GalleryImage[]>([]);
  roomTypes     = signal<RoomType[]>([]);
  loading       = signal(true);
  loadingReviews = signal(true);
  loadingRooms  = signal(true);
  submittingReview = signal(false);

  userHasReview = computed(() =>
    this.reviews().some(r =>
      r.userName === this.auth.currentUser()?.name
    )
  );

  reviewForm = this.fb.group({
    rating:  [0, [Validators.required, Validators.min(1)]],
    title:   [''],
    comment: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Cargar hotel
    this.hotelService.findById(id).subscribe({
      next: res => {
        this.hotel.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });

    // Cargar tipos de habitación
    this.roomTypeService.findByHotel(id).subscribe({
      next: res => {
        this.roomTypes.set(res.data);
        this.loadingRooms.set(false);
      },
      error: () => this.loadingRooms.set(false)
    });

    // Cargar reseñas
    this.reviewService.getByHotel(id).subscribe({
      next: res => {
        this.reviews.set(res.data);
        this.loadingReviews.set(false);
      },
      error: () => this.loadingReviews.set(false)
    });

    // Cargar galería
    this.galleryService.getByHotel(id).subscribe({
      next: res => this.gallery.set(res.data),
      error: () => {}
    });
  }

  submitReview() {
    if (this.reviewForm.invalid) return;
    this.submittingReview.set(true);

    const hotelId = Number(this.route.snapshot.paramMap.get('id'));
    const dto: ReviewRequest = {
      rating:  this.reviewForm.value.rating!,
      title:   this.reviewForm.value.title || undefined,
      comment: this.reviewForm.value.comment!,
    };

    this.reviewService.create(hotelId, dto).subscribe({
      next: res => {
        this.reviews.update(reviews => [res.data, ...reviews]);
        this.reviewForm.reset({ rating: 0 });
        this.toast.success('¡Reseña publicada exitosamente!');
        this.submittingReview.set(false);
      },
      error: err => {
        this.toast.error(err.error?.message || 'Error al publicar la reseña');
        this.submittingReview.set(false);
      }
    });
  }
}