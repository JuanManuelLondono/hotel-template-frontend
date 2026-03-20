import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center
                justify-center px-4 py-12">
      <div class="w-full max-w-md">

        <!-- Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          <!-- Header -->
          <div class="text-center mb-8">
            <span class="text-4xl">🏨</span>
            <h1 class="font-serif text-2xl font-bold text-gray-900 mt-3">
              Bienvenido de vuelta
            </h1>
            <p class="text-gray-500 text-sm mt-1">
              Inicia sesión para continuar
            </p>
          </div>

          <!-- Formulario -->
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                formControlName="email"
                placeholder="tu@email.com"
                class="w-full px-4 py-3 border rounded-xl text-sm outline-none
                       transition-colors focus:border-primary-500 focus:ring-2
                       focus:ring-primary-100"
                [class.border-red-400]="isInvalid('email')"
                [class.border-gray-200]="!isInvalid('email')"/>
              @if (isInvalid('email')) {
                <p class="text-red-500 text-xs mt-1">Email inválido</p>
              }
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div class="relative">
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="••••••••"
                  class="w-full px-4 py-3 border rounded-xl text-sm outline-none
                         transition-colors focus:border-primary-500 focus:ring-2
                         focus:ring-primary-100 pr-12"
                  [class.border-red-400]="isInvalid('password')"
                  [class.border-gray-200]="!isInvalid('password')"/>
                <button
                  type="button"
                  (click)="showPassword.set(!showPassword())"
                  class="absolute right-3 top-1/2 -translate-y-1/2
                         text-gray-400 hover:text-gray-600 text-sm">
                  {{ showPassword() ? '🙈' : '👁' }}
                </button>
              </div>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              [disabled]="form.invalid || loading()"
              class="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300
                     text-white py-3 rounded-xl font-semibold transition-colors
                     text-sm mt-2">
              @if (loading()) {
                <span>Iniciando sesión...</span>
              } @else {
                <span>Iniciar Sesión</span>
              }
            </button>
          </form>

          <!-- Footer -->
          <p class="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?
            <a routerLink="/auth/register"
               class="text-primary-600 hover:text-primary-700 font-medium">
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb      = inject(FormBuilder);
  private auth    = inject(AuthService);
  private router  = inject(Router);
  private toast   = inject(ToastService);

  loading      = signal(false);
  showPassword = signal(false);

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { email, password } = this.form.value;

    this.auth.login({ email: email!, password: password! }).subscribe({
      next: res => {
        this.toast.success(`¡Bienvenido, ${res.data.name}!`);
        // Redirigir según el rol
        if (res.data.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: err => {
        this.toast.error(err.error?.message || 'Email o contraseña incorrectos');
        this.loading.set(false);
      }
    });
  }
}