import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RoomTypeService, RoomType, RoomTypeRequest } from '../../../core/services/room-type.service';
import { HotelService } from '../../../core/services/hotel.service';
import { AmenityService } from '../../../core/services/amenity.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { CurrencyCopPipe } from '../../../shared/pipes/currency-cop.pipe';
import { HotelSummary } from '../../../core/models/hotel.model';
import { Amenity } from '../../../core/services/room-type.service';

@Component({
  selector: 'app-admin-room-types',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent, CurrencyCopPipe],
  template: `
    <div class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="font-serif text-3xl font-bold text-gray-900">Habitaciones</h1>
          <p class="text-gray-500 mt-1">Gestiona los tipos de habitación</p>
        </div>
        <button (click)="openForm()"
                class="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5
                       rounded-xl text-sm font-semibold transition-colors">
          + Nuevo Tipo
        </button>
      </div>

      <!-- Selector hotel -->
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
        <app-loading-spinner text="Cargando..." />
      } @else if (roomTypes().length === 0 && selectedHotelId()) {
        <div class="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <span class="text-4xl">🛏</span>
          <p class="text-gray-400 mt-3">No hay tipos de habitación para este hotel</p>
        </div>
      } @else if (roomTypes().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (room of roomTypes(); track room.id) {
            <div class="bg-white border border-gray-100 rounded-2xl shadow-sm
                        overflow-hidden">
              <div class="h-32 bg-gradient-to-br from-secondary-100 to-primary-100
                          flex items-center justify-center">
                @if (room.coverImageUrl) {
                  <img [src]="room.coverImageUrl" [alt]="room.name"
                       class="w-full h-full object-cover"/>
                } @else {
                  <span class="text-4xl">🛏</span>
                }
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-gray-900">{{ room.name }}</h3>
                <p class="text-primary-600 font-bold mt-1">
                  {{ room.pricePerNight | currencyCop }}/noche
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  👤 {{ room.capacity }} personas ·
                  {{ room.availableRooms }} disponibles
                </p>
                <div class="flex gap-2 mt-4">
                  <button (click)="editRoom(room)"
                          class="flex-1 text-xs text-primary-600 border
                                 border-primary-200 py-1.5 rounded-lg
                                 hover:bg-primary-50 transition-colors">
                    Editar
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>

    <!-- Modal -->
    @if (showForm()) {
      <div class="fixed inset-0 bg-black/50 z-50 flex items-center
                  justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg">
          <div class="flex justify-between items-center px-6 py-4
                      border-b border-gray-100">
            <h2 class="font-serif text-xl font-bold text-gray-900">
              {{ editingRoom() ? 'Editar Habitación' : 'Nueva Habitación' }}
            </h2>
            <button (click)="closeForm()"
                    class="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <form [formGroup]="roomForm" (ngSubmit)="onSubmit()" class="p-6 flex flex-col gap-4">

            <!-- Hotel selector en el form -->
            @if (!editingRoom()) {
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Hotel *
                </label>
                <select formControlName="hotelId"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                               text-sm outline-none focus:border-primary-500 bg-white">
                  <option value="">Selecciona hotel</option>
                  @for (hotel of hotels(); track hotel.id) {
                    <option [value]="hotel.id">{{ hotel.name }}</option>
                  }
                </select>
              </div>
            }

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input type="text" formControlName="name"
                     class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                            text-sm outline-none focus:border-primary-500"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea formControlName="description" rows="3"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                               text-sm outline-none focus:border-primary-500
                               resize-none"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Precio/noche *
                </label>
                <input type="number" formControlName="pricePerNight"
                       class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                              text-sm outline-none focus:border-primary-500"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Capacidad *
                </label>
                <input type="number" formControlName="capacity" min="1"
                       class="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                              text-sm outline-none focus:border-primary-500"/>
              </div>
            </div>

            <!-- Amenities -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div class="flex flex-wrap gap-2">
                @for (amenity of amenities(); track amenity.id) {
                  <button type="button"
                          (click)="toggleAmenity(amenity.id)"
                          class="px-3 py-1.5 rounded-full text-xs font-medium
                                 transition-colors border"
                          [class]="selectedAmenities().includes(amenity.id)
                            ? 'bg-primary-500 text-white border-primary-500'
                            : 'bg-white text-gray-600 border-gray-200
                               hover:border-primary-300'">
                    {{ amenity.name }}
                  </button>
                }
              </div>
            </div>

            <div class="flex gap-3 pt-2">
              <button type="button" (click)="closeForm()"
                      class="flex-1 border border-gray-200 hover:bg-gray-50
                             text-gray-700 py-2.5 rounded-xl text-sm
                             font-medium transition-colors">
                Cancelar
              </button>
              <button type="submit"
                      [disabled]="roomForm.invalid || submitting()"
                      class="flex-1 bg-primary-500 hover:bg-primary-600
                             disabled:bg-gray-300 text-white py-2.5 rounded-xl
                             text-sm font-semibold transition-colors">
                {{ submitting() ? 'Guardando...' :
                   (editingRoom() ? 'Actualizar' : 'Crear') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class RoomTypesComponent implements OnInit {
  private roomTypeService = inject(RoomTypeService);
  private hotelService    = inject(HotelService);
  private amenityService  = inject(AmenityService);
  private toast           = inject(ToastService);
  private fb              = inject(FormBuilder);

  hotels            = signal<HotelSummary[]>([]);
  roomTypes         = signal<RoomType[]>([]);
  amenities         = signal<Amenity[]>([]);
  loading           = signal(false);
  showForm          = signal(false);
  submitting        = signal(false);
  editingRoom       = signal<RoomType | null>(null);
  selectedHotelId   = signal<number | null>(null);
  selectedAmenities = signal<number[]>([]);

  roomForm = this.fb.group({
    hotelId:      [''],
    name:         ['', Validators.required],
    description:  ['', Validators.required],
    pricePerNight:[null as number | null, [Validators.required, Validators.min(1)]],
    capacity:     [1, [Validators.required, Validators.min(1)]],
  });

  ngOnInit() {
    this.hotelService.findAll().subscribe({
      next: res => this.hotels.set(res.data)
    });
    this.amenityService.findAll().subscribe({
      next: res => this.amenities.set(res.data)
    });
  }

  onHotelChange(event: Event) {
    const id = Number((event.target as HTMLSelectElement).value);
    if (!id) return;
    this.selectedHotelId.set(id);
    this.loading.set(true);
    this.roomTypeService.findByHotel(id).subscribe({
      next: res => {
        this.roomTypes.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  toggleAmenity(id: number) {
    this.selectedAmenities.update(list =>
      list.includes(id) ? list.filter(a => a !== id) : [...list, id]
    );
  }

  openForm() {
    this.editingRoom.set(null);
    this.selectedAmenities.set([]);
    this.roomForm.reset({ capacity: 1 });
    this.showForm.set(true);
  }

  editRoom(room: RoomType) {
    this.editingRoom.set(room);
    this.selectedAmenities.set(room.amenities?.map(a => a.id) ?? []);
    this.roomForm.patchValue({
      name:         room.name,
      description:  room.description,
      pricePerNight:room.pricePerNight,
      capacity:     room.capacity,
    });
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingRoom.set(null);
    this.roomForm.reset();
    this.selectedAmenities.set([]);
  }

  onSubmit() {
    if (this.roomForm.invalid) return;
    this.submitting.set(true);

    const dto: RoomTypeRequest = {
      name:         this.roomForm.value.name!,
      description:  this.roomForm.value.description!,
      pricePerNight:Number(this.roomForm.value.pricePerNight),
      capacity:     Number(this.roomForm.value.capacity),
      amenityIds:   this.selectedAmenities(),
    };

    const editing = this.editingRoom();
    const hotelId = editing
      ? editing.hotelId
      : Number(this.roomForm.value.hotelId);

    const request = editing
      ? this.roomTypeService.update(editing.id, dto)
      : this.roomTypeService.create(hotelId, dto);

    request.subscribe({
      next: () => {
        this.toast.success(editing ? 'Habitación actualizada' : 'Habitación creada');
        this.closeForm();
        if (this.selectedHotelId()) {
          this.roomTypeService.findByHotel(this.selectedHotelId()!).subscribe({
            next: res => this.roomTypes.set(res.data)
          });
        }
        this.submitting.set(false);
      },
      error: err => {
        this.toast.error(err.error?.message || 'Error al guardar');
        this.submitting.set(false);
      }
    });
  }
}