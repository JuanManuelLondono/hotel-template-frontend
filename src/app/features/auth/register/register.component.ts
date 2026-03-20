import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center
                justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          <!-- Header -->
          <div class="text-center mb-8">
            <span class="text-4xl">🏨</span>
            <h1 class="font-serif text-2xl font-bold text-gray-900 mt-3">
              Crear cuenta
            </h1>
            <p class="text-gray-500 text-sm mt-1">
              Únete y empieza a reservar
            </p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">

            <!-- Nombre -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                formControlName="name"
                placeholder="Juan Pérez"
                class="w-full px-4 py-3 border rounded-xl text-sm outline-none
                       transition-colors focus:border-primary-500 focus:ring-2
                       focus:ring-primary-100"
                [class.border-red-400]="isInvalid('name')"
                [class.border-gray-200]="!isInvalid('name')"/>
              @if (isInvalid('name')) {
                <p class="text-red-500 text-xs mt-1">
                  El nombre debe tener al menos 2 caracteres
                </p>
              }
            </div>

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
                  placeholder="Mínimo 8 caracteres"
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
              @if (isInvalid('password')) {
                <p class="text-red-500 text-xs mt-1">
                  Mínimo 8 caracteres con mayúscula, minúscula y número
                </p>
              }
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <input
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="confirmPassword"
                placeholder="Repite tu contraseña"
                class="w-full px-4 py-3 border rounded-xl text-sm outline-none
                       transition-colors focus:border-primary-500 focus:ring-2
                       focus:ring-primary-100"
                [class.border-red-400]="isInvalid('confirmPassword') ||
                                        form.hasError('passwordMismatch')"
                [class.border-gray-200]="!isInvalid('confirmPassword')"/>
              @if (form.hasError('passwordMismatch') &&
                   form.get('confirmPassword')?.touched) {
                <p class="text-red-500 text-xs mt-1">
                  Las contraseñas no coinciden
                </p>
              }
            </div>

            <!-- Submit -->
            <button
              type="submit"
              [disabled]="form.invalid || loading()"
              class="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300
                     text-white py-3 rounded-xl font-semibold transition-colors
                     text-sm mt-2">
              @if (loading()) {
                <span>Creando cuenta...</span>
              } @else {
                <span>Crear Cuenta</span>
              }
            </button>
          </form>

          <p class="text-center text-sm text-gray-500 mt-6">
            ¿Ya tienes cuenta?
            <a routerLink="/auth/login"
               class="text-primary-600 hover:text-primary-700 font-medium">
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);
  private toast  = inject(ToastService);

  loading      = signal(false);
  showPassword = signal(false);

  form = this.fb.group({
    name:            ['', [Validators.required, Validators.minLength(2)]],
    email:           ['', [Validators.required, Validators.email]],
    password:        ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    ]],
    confirmPassword: ['', Validators.required],
  }, { validators: this.passwordMatch });

  passwordMatch(control: AbstractControl) {
    const password        = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

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
    const { name, email, password } = this.form.value;

    this.auth.register({ name: name!, email: email!, password: password! }).subscribe({
      next: res => {
        this.toast.success(`¡Bienvenido, ${res.data.name}!`);
        this.router.navigate(['/']);
      },
      error: err => {
        this.toast.error(err.error?.message || 'Error al crear la cuenta');
        this.loading.set(false);
      }
    });
  }
}