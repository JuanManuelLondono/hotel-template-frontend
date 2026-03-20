import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white
                 min-w-72 max-w-sm animate-slide-in"
          [class]="getClass(toast)">

          <!-- Icono -->
          <span class="text-lg flex-shrink-0">
            {{ getIcon(toast.type) }}
          </span>

          <!-- Mensaje -->
          <p class="text-sm font-medium flex-1">{{ toast.message }}</p>

          <!-- Cerrar -->
          <button
            (click)="toastService.remove(toast.id)"
            class="text-white/80 hover:text-white flex-shrink-0">
            ✕
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);

  getClass(toast: Toast): string {
    const classes: Record<Toast['type'], string> = {
      success: 'bg-green-600',
      error:   'bg-red-600',
      warning: 'bg-amber-500',
      info:    'bg-blue-600',
    };
    return classes[toast.type];
  }

  getIcon(type: Toast['type']): string {
    const icons: Record<Toast['type'], string> = {
      success: '✓',
      error:   '✕',
      warning: '⚠',
      info:    'ℹ',
    };
    return icons[type];
  }
}