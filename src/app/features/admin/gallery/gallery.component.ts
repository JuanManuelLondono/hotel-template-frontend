import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GalleryService, GalleryImage } from '../../../core/services/gallery.service';
import { HotelService } from '../../../core/services/hotel.service';
import { RoomTypeService, RoomType } from '../../../core/services/room-type.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { HotelSummary } from '../../../core/models/hotel.model';
import { CurrencyCopPipe } from '../../../shared/pipes/currency-cop.pipe';

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUploadComponent,
            LoadingSpinnerComponent, CurrencyCopPipe],
  template: `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="font-serif text-3xl font-bold text-gray-900">Galería</h1>
        <p class="text-gray-500 mt-1">Gestiona las imágenes de hoteles y habitaciones</p>
      </div>

      <!-- Paso 1 — Seleccionar hotel -->
      <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
        <h2 class="font-semibold text-gray-800 mb-4">1. Selecciona el hotel</h2>
        <select (change)="onHotelChange($event)"
                class="w-full sm:w-96 px-4 py-2.5 border border-gray-200 rounded-xl
                       text-sm outline-none focus:border-primary-500 bg-white">
          <option value="">— Selecciona un hotel —</option>
          @for (hotel of hotels(); track hotel.id) {
            <option [value]="hotel.id">{{ hotel.name }} · {{ hotel.city }}</option>
          }
        </select>
      </div>

      @if (selectedHotel()) {

        <!-- Paso 2 — Seleccionar destino -->
        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
          <h2 class="font-semibold text-gray-800 mb-4">2. ¿Dónde va la imagen?</h2>
          <div class="flex gap-3">
            <button
              (click)="uploadTarget.set('hotel')"
              class="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm
                     font-semibold border transition-colors"
              [class]="uploadTarget() === 'hotel'
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'">
              🏨 Hotel general
            </button>
            <button
              (click)="uploadTarget.set('room')"
              class="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm
                     font-semibold border transition-colors"
              [class]="uploadTarget() === 'room'
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'">
              🛏 Tipo de habitación
            </button>
          </div>

          <!-- Selector de habitación si aplica -->
          @if (uploadTarget() === 'room') {
            @if (loadingRooms()) {
              <p class="text-sm text-gray-400 mt-4">Cargando habitaciones...</p>
            } @else if (roomTypes().length === 0) {
              <p class="text-sm text-gray-400 mt-4">
                Este hotel no tiene tipos de habitación
              </p>
            } @else {
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de habitación
                </label>
                <select (change)="onRoomTypeChange($event)"
                        class="w-full sm:w-96 px-4 py-2.5 border border-gray-200
                               rounded-xl text-sm outline-none focus:border-primary-500
                               bg-white">
                  <option value="">— Selecciona habitación —</option>
                  @for (room of roomTypes(); track room.id) {
                    <option [value]="room.id">
                      {{ room.name }} · {{ room.pricePerNight | currencyCop }}/noche
                    </option>
                  }
                </select>
              </div>
            }
          }
        </div>

        <!-- Paso 3 — Subir imagen -->
        @if (uploadTarget() === 'hotel' ||
             (uploadTarget() === 'room' && selectedRoomTypeId())) {
          <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
            <h2 class="font-semibold text-gray-800 mb-4">3. Configura y sube la imagen</h2>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">

              <!-- Categoría -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select [(ngModel)]="uploadCategory"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                               text-sm outline-none focus:border-primary-500 bg-white">
                  @for (cat of categories; track cat.value) {
                    <option [value]="cat.value">{{ cat.label }}</option>
                  }
                </select>
              </div>

              <!-- Alt text -->
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Texto alternativo
                  <span class="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input type="text"
                       [(ngModel)]="uploadAltText"
                       placeholder="Ej: Vista de la piscina del hotel"
                       class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                              text-sm outline-none focus:border-primary-500"/>
              </div>
            </div>

            <!-- Subida -->
            <app-image-upload
              label="Selecciona o arrastra una imagen"
              (fileSelected)="onFileSelected($event)" />

            @if (selectedFile()) {
              <div class="mt-4 flex items-center justify-between bg-gray-50
                          rounded-xl px-4 py-3">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">📎</span>
                  <div>
                    <p class="text-sm font-medium text-gray-800">
                      {{ selectedFile()!.name }}
                    </p>
                    <p class="text-xs text-gray-400">
                      {{ (selectedFile()!.size / 1024 / 1024) | number:'1.1-2' }} MB
                    </p>
                  </div>
                </div>
                <button
                  (click)="uploadImage()"
                  [disabled]="uploading()"
                  class="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300
                         text-white px-6 py-2 rounded-xl text-sm font-semibold
                         transition-colors">
                  {{ uploading() ? 'Subiendo...' : 'Subir imagen' }}
                </button>
              </div>
            }
          </div>
        }

        <!-- Galería actual -->
        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-semibold text-gray-800">
              Galería actual
              @if (images().length > 0) {
                <span class="text-gray-400 font-normal ml-1">
                  ({{ images().length }} imágenes)
                </span>
              }
            </h2>

            <!-- Filtro por categoría -->
            @if (images().length > 0) {
              <select [(ngModel)]="filterCategory"
                      class="px-3 py-1.5 border border-gray-200 rounded-xl text-xs
                             outline-none focus:border-primary-500 bg-white">
                <option value="">Todas las categorías</option>
                @for (cat of categories; track cat.value) {
                  <option [value]="cat.value">{{ cat.label }}</option>
                }
              </select>
            }
          </div>

          @if (loadingGallery()) {
            <app-loading-spinner text="Cargando galería..." />
          } @else if (filteredImages().length === 0) {
            <div class="text-center py-12">
              <span class="text-4xl">🖼</span>
              <p class="text-gray-400 mt-3">
                {{ images().length === 0
                  ? 'No hay imágenes en la galería'
                  : 'No hay imágenes en esta categoría' }}
              </p>
            </div>
          } @else {
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              @for (image of filteredImages(); track image.id) {
                <div class="relative group aspect-square rounded-xl overflow-hidden
                            bg-gray-100 cursor-pointer">
                  <img [src]="image.imageUrl"
                       [alt]="image.altText || 'Imagen'"
                       class="w-full h-full object-cover transition-transform
                              duration-300 group-hover:scale-105"/>

                  <!-- Overlay -->
                  <div class="absolute inset-0 bg-black/60 opacity-0
                              group-hover:opacity-100 transition-opacity
                              flex flex-col justify-between p-3">
                    <div class="flex justify-between items-start">
                      <span class="text-xs bg-white/20 backdrop-blur-sm text-white
                                   px-2 py-0.5 rounded-full">
                        {{ image.category }}
                      </span>
                      <button
                        (click)="deleteImage(image)"
                        class="bg-red-600 hover:bg-red-700 text-white rounded-lg
                               w-7 h-7 flex items-center justify-center text-sm
                               transition-colors flex-shrink-0">
                        🗑
                      </button>
                    </div>
                    @if (image.altText) {
                      <p class="text-xs text-white/80 truncate">
                        {{ image.altText }}
                      </p>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `
})
export class GalleryAdminComponent implements OnInit {
  private galleryService  = inject(GalleryService);
  private hotelService    = inject(HotelService);
  private roomTypeService = inject(RoomTypeService);
  private toast           = inject(ToastService);

  // Estado
  hotels            = signal<HotelSummary[]>([]);
  roomTypes         = signal<RoomType[]>([]);
  images            = signal<GalleryImage[]>([]);
  selectedHotel     = signal<HotelSummary | null>(null);
  selectedRoomTypeId = signal<number | null>(null);
  uploadTarget      = signal<'hotel' | 'room'>('hotel');
  selectedFile      = signal<File | null>(null);

  // Loading
  loadingRooms   = signal(false);
  loadingGallery = signal(false);
  uploading      = signal(false);

  // Form
  uploadCategory = 'GENERAL';
  uploadAltText  = '';
  filterCategory = '';

  categories = [
    { value: 'GENERAL',    label: '🌐 General' },
    { value: 'ROOM',       label: '🛏 Habitación' },
    { value: 'POOL',       label: '🏊 Piscina' },
    { value: 'RESTAURANT', label: '🍽 Restaurante' },
    { value: 'SPA',        label: '💆 Spa' },
    { value: 'EXTERIOR',   label: '🏙 Exterior' },
    { value: 'AMENITIES',  label: '✨ Amenities' },
  ];

  // Computed — filtra imágenes por categoría
  filteredImages = () => {
    if (!this.filterCategory) return this.images();
    return this.images().filter(i => i.category === this.filterCategory);
  };

  ngOnInit() {
    this.hotelService.findAll().subscribe({
      next: res => this.hotels.set(res.data)
    });
  }

  onHotelChange(event: Event) {
    const id = Number((event.target as HTMLSelectElement).value);
    if (!id) {
      this.selectedHotel.set(null);
      this.images.set([]);
      this.roomTypes.set([]);
      return;
    }

    const hotel = this.hotels().find(h => h.id === id) ?? null;
    this.selectedHotel.set(hotel);
    this.selectedRoomTypeId.set(null);
    this.uploadTarget.set('hotel');
    this.selectedFile.set(null);

    // Cargar galería y habitaciones en paralelo
    this.loadGallery(id);
    this.loadRoomTypes(id);
  }

  onRoomTypeChange(event: Event) {
    const id = Number((event.target as HTMLSelectElement).value);
    this.selectedRoomTypeId.set(id || null);
  }

  private loadGallery(hotelId: number) {
    this.loadingGallery.set(true);
    this.galleryService.getByHotel(hotelId).subscribe({
      next: res => {
        this.images.set(res.data);
        this.loadingGallery.set(false);
      },
      error: () => this.loadingGallery.set(false)
    });
  }

  private loadRoomTypes(hotelId: number) {
    this.loadingRooms.set(true);
    this.roomTypeService.findByHotel(hotelId).subscribe({
      next: res => {
        this.roomTypes.set(res.data);
        this.loadingRooms.set(false);
      },
      error: () => this.loadingRooms.set(false)
    });
  }

  onFileSelected(file: File) {
    this.selectedFile.set(file);
  }

  uploadImage() {
    const hotel = this.selectedHotel();
    if (!this.selectedFile() || !hotel) return;
    
    this.uploading.set(true);
    const formData = new FormData();
    formData.append('file', this.selectedFile()!);
    formData.append('category', this.uploadCategory);

    if (this.uploadAltText) {
      formData.append('altText', this.uploadAltText);
    }

    // Si es para habitación, agregar roomTypeId
    if (this.uploadTarget() === 'room' && this.selectedRoomTypeId()) {
      formData.append('roomTypeId', String(this.selectedRoomTypeId()));
    }

    this.galleryService.upload(hotel.id, formData).subscribe({
      next: res => {
        // Agregar la nueva imagen a la galería local
        this.images.update(list => [...list, res.data]);
        this.selectedFile.set(null);
        this.uploadAltText = '';
        this.toast.success('Imagen subida exitosamente');
        this.uploading.set(false);
      },
      error: err => {
        console.error('Error subiendo imagen:', err);
        this.toast.error(err.error?.message || 'Error al subir la imagen');
        this.uploading.set(false);
      }
    });
  }

  deleteImage(image: GalleryImage) {
    if (!confirm('¿Eliminar esta imagen permanentemente?')) return;
    this.galleryService.delete(image.id).subscribe({
      next: () => {
        this.images.update(list => list.filter(i => i.id !== image.id));
        this.toast.success('Imagen eliminada');
      },
      error: err => this.toast.error(err.error?.message || 'Error al eliminar')
    });
  }
}