import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {

  toasts = signal<Toast[]>([]);
  private nextId = 0;

  success(message: string) { this.add(message, 'success'); }
  error(message: string)   { this.add(message, 'error'); }
  warning(message: string) { this.add(message, 'warning'); }
  info(message: string)    { this.add(message, 'info'); }

  remove(id: number) {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  private add(message: string, type: Toast['type']) {
    const id = this.nextId++;
    this.toasts.update(toasts => [...toasts, { id, message, type }]);
    // Auto-eliminar después de 4 segundos
    setTimeout(() => this.remove(id), 4000);
  }
}