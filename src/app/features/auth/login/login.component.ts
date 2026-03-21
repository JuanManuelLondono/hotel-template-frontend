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
    <div class="min-h-screen bg-auth-gradient flex items-center
            justify-center px-4 py-12">

      <div class="w-full max-w-md">

        <!-- Logo -->
        <div class="text-center mb-10">
          <p class="font-headline text-3xl font-bold tracking-tighter
                     text-primary mb-2">
            HotelTemplate
          </p>
          <p class="text-primary-400 text-xs uppercase tracking-[0.3em]">
            Acceso exclusivo
          </p>
        </div>

        <!-- Card -->
        <div class="bg-white border border-primary-100 rounded-xl shadow-sm p-8">

          <h1 class="font-headline text-xl font-bold text-primary mb-1">
            Bienvenido de vuelta
          </h1>
          <p class="text-primary-400 text-sm mb-8">
            Inicia sesión para continuar
          </p>

          <form [formGroup]="form" (ngSubmit)="onSubmit()"
                class="flex flex-col gap-5">

            <!-- Email -->
            <div>
              <label class="block text-xs uppercase tracking-widest
                             text-primary-400 mb-2">
                Email
              </label>
              <div class="flex items-center gap-3 bg-primary-50 border rounded-lg
                          px-4 py-3 transition-colors focus-within:border-gold"
                   [class]="isInvalid('email')
                     ? 'border-red-300'
                     : 'border-primary-100'">
                <span class="text-primary-300 text-sm flex-shrink-0">@</span>
                <input
                  type="email"
                  formControlName="email"
                  placeholder="tu@email.com"
                  class="bg-transparent border-none p-0 text-primary text-sm
                         outline-none focus:ring-0 w-full placeholder-primary-300"/>
              </div>
              @if (isInvalid('email')) {
                <p class="text-red-500 text-xs mt-1.5">Email inválido</p>
              }
            </div>

            <!-- Password -->
            <div>
              <label class="block text-xs uppercase tracking-widest
                             text-primary-400 mb-2">
                Contraseña
              </label>
              <div class="flex items-center gap-3 bg-primary-50 border rounded-lg
                          px-4 py-3 transition-colors focus-within:border-gold"
                   [class]="isInvalid('password')
                     ? 'border-red-300'
                     : 'border-primary-100'">
                <svg class="w-5 h-5 text-primary-300 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  <circle cx="12" cy="16" r="1"></circle>
                </svg>
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="••••••••"
                  class="bg-transparent border-none p-0 text-primary text-sm
                         outline-none focus:ring-0 w-full
                         placeholder-primary-300 flex-1"/>
                <button
                  type="button"
                  (click)="showPassword.set(!showPassword())"
                  class="text-primary-300 hover:text-primary-500
                         transition-colors flex-shrink-0">
                  <svg *ngIf="!showPassword()" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 9q-3.6 4-9 4T3 9m0 6l2.5-3.8M21 14.976L18.508 11.2M9 17l.5-4m5.5 4l-.5-4"></path>
                  </svg>
                  <svg *ngIf="showPassword()" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.5 18c4 0 7.46-2.22 9.24-5.5C18.96 9.22 15.5 7 11.5 7s-7.46 2.22-9.24 5.5C4.04 15.78 7.5 18 11.5 18m0-12c4.56 0 8.5 2.65 10.36 6.5C20 16.35 16.06 19 11.5 19S3 16.35 1.14 12.5C3 8.65 6.94 6 11.5 6m0 2C14 8 16 10 16 12.5S14 17 11.5 17S7 15 7 12.5S9 8 11.5 8m0 1A3.5 3.5 0 0 0 8 12.5a3.5 3.5 0 0 0 3.5 3.5a3.5 3.5 0 0 0 3.5-3.5A3.5 3.5 0 0 0 11.5 9"></path>
                  </svg>
                </button>
              </div>
              @if (isInvalid('password')) {
                <p class="text-red-500 text-xs mt-1.5">
                  Ingresa tu contraseña
                </p>
              }
            </div>

            <!-- Submit -->
            <button
              type="submit"
              [disabled]="form.invalid || loading()"
              class="w-full py-3.5 rounded-lg font-headline font-semibold
                     text-sm tracking-wide transition-all active:scale-95 mt-2"
              [class]="form.invalid || loading()
                ? 'bg-primary-100 text-primary-300 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-800 text-white'">
              {{ loading() ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
          </form>

          <!-- Footer -->
          <div class="border-t border-primary-50 mt-6 pt-6 text-center">
            <p class="text-primary-400 text-xs">
              ¿No tienes cuenta?
              <a routerLink="/auth/register"
                 class="text-secondary hover:text-secondary-600 font-semibold
                        transition-colors ml-1">
                Regístrate
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);
  private toast  = inject(ToastService);

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