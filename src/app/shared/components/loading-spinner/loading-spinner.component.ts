import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center gap-3"
         [class]="fullScreen() ? 'min-h-screen' : 'py-12'">

      <!-- Spinner -->
      <div class="w-10 h-10 border-4 border-primary-200 border-t-primary-500
                  rounded-full animate-spin"></div>

      <!-- Texto opcional -->
      @if (text()) {
        <p class="text-gray-500 text-sm">{{ text() }}</p>
      }
    </div>
  `
})
export class LoadingSpinnerComponent {
  text    = input<string>('');
  fullScreen = input<boolean>(false);
}