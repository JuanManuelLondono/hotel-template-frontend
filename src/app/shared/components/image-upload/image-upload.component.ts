import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-3">

      <!-- Preview imagen actual -->
      @if (currentImageUrl()) {
        <div class="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
          <img [src]="currentImageUrl()"
               [alt]="label()"
               class="w-full h-full object-cover"/>
          <button
            type="button"
            (click)="clearImage()"
            class="absolute top-2 right-2 bg-red-600 text-white rounded-full
                   w-7 h-7 flex items-center justify-center text-sm
                   hover:bg-red-700 transition-colors">
            ✕
          </button>
        </div>
      }

      <!-- Zona de drop -->
      <div
        class="border-2 border-dashed rounded-xl p-6 text-center transition-colors
               cursor-pointer"
        [class]="dragging()
          ? 'border-primary-400 bg-primary-50'
          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'"
        (click)="fileInput.click()"
        (dragover)="onDragOver($event)"
        (dragleave)="dragging.set(false)"
        (drop)="onDrop($event)">

        @if (uploading()) {
          <div class="flex flex-col items-center gap-2">
            <div class="w-8 h-8 border-3 border-primary-200 border-t-primary-500
                        rounded-full animate-spin"></div>
            <p class="text-sm text-gray-500">Subiendo imagen...</p>
          </div>
        } @else {
          <div class="flex flex-col items-center gap-2">
            <span class="text-3xl">📷</span>
            <p class="text-sm font-medium text-gray-700">
              {{ label() }}
            </p>
            <p class="text-xs text-gray-400">
              Arrastra una imagen o haz clic para seleccionar
            </p>
            <p class="text-xs text-gray-300">PNG, JPG, WEBP · Máx 5MB</p>
          </div>
        }
      </div>

      <!-- Input oculto -->
      <input #fileInput
             type="file"
             accept="image/*"
             class="hidden"
             (change)="onFileSelected($event)"/>

      @if (error()) {
        <p class="text-red-500 text-xs">{{ error() }}</p>
      }
    </div>
  `
})
export class ImageUploadComponent {
  label          = input<string>('Subir imagen');
  currentImageUrl = input<string>('');
  maxSizeMb      = input<number>(5);

  fileSelected = output<File>();
  imageCleared = output<void>();

  dragging  = signal(false);
  uploading = signal(false);
  error     = signal('');

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragging.set(true);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.processFile(file);
  }

  processFile(file: File) {
    this.error.set('');

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      this.error.set('Solo se permiten imágenes');
      return;
    }

    // Validar tamaño
    const maxBytes = this.maxSizeMb() * 1024 * 1024;
    if (file.size > maxBytes) {
      this.error.set(`La imagen no puede superar ${this.maxSizeMb()}MB`);
      return;
    }

    this.fileSelected.emit(file);
  }

  clearImage() {
    this.imageCleared.emit();
  }

  setUploading(value: boolean) {
    this.uploading.set(value);
  }
}