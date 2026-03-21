import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HotelService } from '../../../core/services/hotel.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { HotelSummary } from '../../../core/models/hotel.model';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';
import { GalleryService } from '../../../core/services/gallery.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-admin-hotels',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LoadingSpinnerComponent, ImageUploadComponent],
  template: `
    <div class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">

      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="font-serif text-3xl font-bold text-gray-900">Hoteles</h1>
          <p class="text-gray-500 mt-1">Gestiona los hoteles del sistema</p>
        </div>
        <button
          (click)="openForm()"
          class="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5
                 rounded-xl text-sm font-semibold transition-colors">
          + Nuevo Hotel
        </button>
      </div>

      @if (loading()) {
        <app-loading-spinner text="Cargando hoteles..." />
      } @else {
        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500
                           uppercase tracking-wider">Hotel</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500
                           uppercase tracking-wider hidden sm:table-cell">Ciudad</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500
                           uppercase tracking-wider hidden md:table-cell">Rating</th>
                <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500
                           uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              @for (hotel of hotels(); track hotel.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-gradient-to-br from-secondary-100
                                  to-primary-100 rounded-xl flex items-center
                                  justify-center flex-shrink-0">
                        @if (hotel.coverImageUrl) {
                          <img [src]="hotel.coverImageUrl"
                               [alt]="hotel.name"
                               class="w-full h-full object-cover rounded-xl"/>
                        } @else {
                          <span class="text-lg">🏨</span>
                        }
                      </div>
                      <div>
                        <p class="font-semibold text-sm text-gray-900">
                          {{ hotel.name }}
                        </p>
                        <p class="text-xs text-gray-400">{{ hotel.country }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">
                    {{ hotel.city }}
                  </td>
                  <td class="px-6 py-4 hidden md:table-cell">
                    <div class="flex items-center gap-1">
                      <span class="text-amber-400 text-sm">★</span>
                      <span class="text-sm font-medium text-gray-700">
                        {{ hotel.averageRating | number:'1.1-1' }}
                      </span>
                      <span class="text-xs text-gray-400">
                        ({{ hotel.totalReviews }})
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                      <a [routerLink]="['/hotels', hotel.id]"
                         class="text-xs text-gray-500 hover:text-gray-700
                                border border-gray-200 px-3 py-1.5 rounded-lg
                                transition-colors">
                        Ver
                      </a>
                      <button
                        (click)="editHotel(hotel)"
                        class="text-xs text-primary-600 hover:text-primary-700
                               border border-primary-200 px-3 py-1.5 rounded-lg
                               transition-colors">
                        Editar
                      </button>
                      <button
                        (click)="deleteHotel(hotel)"
                        class="text-xs text-red-600 hover:text-red-700
                               border border-red-200 px-3 py-1.5 rounded-lg
                               transition-colors">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          @if (hotels().length === 0) {
            <div class="text-center py-12">
              <span class="text-4xl">🏨</span>
              <p class="text-gray-400 mt-3">No hay hoteles registrados</p>
            </div>
          }
        </div>
      }
    </div>

    <!-- Modal formulario -->
    @if (showForm()) {
      <div class="fixed inset-0 bg-black/50 z-50 flex items-center
                  justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-4">
          <div class="flex justify-between items-center px-6 py-4
                      border-b border-gray-100">
            <h2 class="font-serif text-xl font-bold text-gray-900">
              {{ editingHotel() ? 'Editar Hotel' : 'Nuevo Hotel' }}
            </h2>
            <button (click)="closeForm()"
                    class="text-gray-400 hover:text-gray-600 text-xl">✕</button>
          </div>

          <form [formGroup]="hotelForm" (ngSubmit)="onSubmit()"
                class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

            <!-- Nombre -->
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input type="text" formControlName="name"
                     class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                            text-sm outline-none focus:border-primary-500"/>
            </div>

            <!-- Descripción -->
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea formControlName="description" rows="3"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                               text-sm outline-none focus:border-primary-500
                               resize-none"></textarea>
            </div>

            <!-- Dirección -->
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Dirección *
              </label>
              <input type="text" formControlName="address"
                     class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                            text-sm outline-none focus:border-primary-500"/>
            </div>

            <!-- Ciudad y País -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Ciudad *
              </label>
              <input type="text" formControlName="city"
                     class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                            text-sm outline-none focus:border-primary-500"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                País *
              </label>
              <input type="text" formControlName="country"
                     class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                            text-sm outline-none focus:border-primary-500"/>
            </div>

            <!-- Latitud y Longitud -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Latitud *
              </label>
              <input type="number" formControlName="latitude" step="any"
                     class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                            text-sm outline-none focus:border-primary-500"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Longitud *
              </label>
              <input type="number" formControlName="longitude" step="any"
                     class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                            text-sm outline-none focus:border-primary-500"/>
            </div>

            <!-- Teléfono y Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input type="text" formControlName="phone"
                     class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                            text-sm outline-none focus:border-primary-500"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input type="email" formControlName="email"
                     class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                            text-sm outline-none focus:border-primary-500"/>
            </div>

            <!-- Check-in y Check-out -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Hora Check-in
              </label>
              <input type="text" formControlName="checkInTime"
                     placeholder="15:00"
                     class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                            text-sm outline-none focus:border-primary-500"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Hora Check-out
              </label>
              <input type="text" formControlName="checkOutTime"
                     placeholder="12:00"
                     class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                            text-sm outline-none focus:border-primary-500"/>
            </div>

            <!-- Política de cancelación -->
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Política de cancelación
              </label>
              <input type="text" formControlName="cancellationPolicy"
                     class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                            text-sm outline-none focus:border-primary-500"/>
            </div>

            <!-- Imagen de portada -->
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Imagen de portada
              </label>
              <app-image-upload
                #imageUpload
                label="Imagen de portada del hotel"
                [currentImageUrl]="coverImagePreview()"
                (fileSelected)="onCoverImageSelected($event)"
                (imageCleared)="coverImagePreview.set('')" />
            </div>

            <!-- Botones -->
            <div class="sm:col-span-2 flex gap-3 pt-2">
              <button type="button" (click)="closeForm()"
                      class="flex-1 border border-gray-200 hover:bg-gray-50
                             text-gray-700 py-2.5 rounded-xl text-sm
                             font-medium transition-colors">
                Cancelar
              </button>
              <button type="submit"
                      [disabled]="hotelForm.invalid || submitting()"
                      class="flex-1 bg-primary-500 hover:bg-primary-600
                             disabled:bg-gray-300 text-white py-2.5 rounded-xl
                             text-sm font-semibold transition-colors">
                {{ submitting() ? 'Guardando...' :
                   (editingHotel() ? 'Actualizar' : 'Crear Hotel') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class HotelsComponent implements OnInit {
  private hotelService = inject(HotelService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  private galleryService = inject(GalleryService);
  coverImageFile = signal<File | null>(null);
  coverImagePreview = signal<string>('');

  hotels = signal<HotelSummary[]>([]);
  loading = signal(true);
  showForm = signal(false);
  submitting = signal(false);
  editingHotel = signal<HotelSummary | null>(null);

  hotelForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    latitude: [null as number | null, Validators.required],
    longitude: [null as number | null, Validators.required],
    phone: [''],
    email: ['', Validators.email],
    checkInTime: [''],
    checkOutTime: [''],
    cancellationPolicy: [''],
  });

  ngOnInit() {
    this.loadHotels();
  }

  loadHotels() {
    this.hotelService.findAll().subscribe({
      next: res => {
        this.hotels.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openForm() {
    this.editingHotel.set(null);
    this.hotelForm.reset();
    this.showForm.set(true);
  }

  editHotel(hotel: HotelSummary) {
    this.editingHotel.set(hotel);
    this.hotelService.findById(hotel.id).subscribe({
      next: res => {
        this.hotelForm.patchValue(res.data);
        this.showForm.set(true);
      }
    });
  }

  closeForm() {
    this.showForm.set(false);
    this.editingHotel.set(null);
    this.hotelForm.reset();
    this.coverImageFile.set(null);
    this.coverImagePreview.set('');
  }

  deleteHotel(hotel: HotelSummary) {
    if (!confirm(`¿Desactivar el hotel "${hotel.name}"?`)) return;
    this.hotelService.deactivate(hotel.id).subscribe({
      next: () => {
        this.hotels.update(list => list.filter(h => h.id !== hotel.id));
        this.toast.success('Hotel desactivado');
      },
      error: err => this.toast.error(err.error?.message || 'Error al desactivar')
    });
  }

  onSubmit() {
    if (this.hotelForm.invalid) {
      this.hotelForm.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    const data = this.hotelForm.value as any;
    const editing = this.editingHotel();

    const request = editing
      ? this.hotelService.update(editing.id, data)
      : this.hotelService.create(data);

    request.subscribe({
      next: (res) => {
        const hotelId = res.data.id;

        if (this.coverImageFile()) {
          const formData = new FormData();
          formData.append('file', this.coverImageFile()!);
          formData.append('altText', `Portada ${res.data.name}`);
          formData.append('category', 'EXTERIOR');

          this.galleryService.upload(hotelId, formData).subscribe({
            next: (galleryRes) => {
              // Actualizar coverImageUrl con la URL de Cloudinary
              const imageUrl = galleryRes.data.imageUrl;
              this.hotelService.updateCoverImage(hotelId, imageUrl).subscribe({
                next: () => {
                  this.toast.success(editing ? 'Hotel actualizado' : 'Hotel creado');
                  this.closeForm();
                  this.loadHotels();
                  this.submitting.set(false);
                },
                error: () => {
                  this.toast.warning('Hotel guardado pero error al actualizar portada');
                  this.closeForm();
                  this.loadHotels();
                  this.submitting.set(false);
                }
              });
            },
            error: () => {
              this.toast.warning('Hotel guardado pero hubo un error con la imagen');
              this.closeForm();
              this.loadHotels();
              this.submitting.set(false);
            }
          });
        } else {
          this.toast.success(editing ? 'Hotel actualizado' : 'Hotel creado');
          this.closeForm();
          this.loadHotels();
          this.submitting.set(false);
        }
      },
      error: err => {
        this.toast.error(err.error?.message || 'Error al guardar');
        this.submitting.set(false);
      }
    });
  }

  onCoverImageSelected(file: File) {
    this.coverImageFile.set(file);
    // Preview local antes de subir
    const reader = new FileReader();
    reader.onload = (e) => this.coverImagePreview.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }
}