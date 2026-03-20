import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">

          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2">
            <span class="text-2xl">🏨</span>
            <span class="font-serif text-xl font-bold text-primary-600">
              HotelTemplate
            </span>
          </a>

          <!-- Links desktop -->
          <div class="hidden md:flex items-center gap-6">
            <a routerLink="/hotels"
               routerLinkActive="text-primary-600 font-semibold"
               class="text-gray-600 hover:text-primary-600 transition-colors text-sm">
              Hoteles
            </a>

            @if (auth.isAdmin()) {
              <a routerLink="/admin"
                 routerLinkActive="text-primary-600 font-semibold"
                 class="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                Admin
              </a>
            }

            @if (auth.isLoggedIn()) {
              <a routerLink="/guest/reservations"
                 routerLinkActive="text-primary-600 font-semibold"
                 class="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                Mis Reservas
              </a>
            }
          </div>

          <!-- Acciones -->
          <div class="flex items-center gap-3">
            @if (auth.isLoggedIn()) {
              <!-- Usuario logueado -->
              <div class="relative">
                <button
                  (click)="menuOpen.set(!menuOpen())"
                  class="flex items-center gap-2 bg-gray-100 hover:bg-gray-200
                         rounded-full px-3 py-1.5 transition-colors">
                  <div class="w-7 h-7 bg-primary-500 rounded-full flex items-center
                              justify-center text-white text-sm font-bold">
                    {{ auth.currentUser()?.name?.charAt(0)?.toUpperCase() }}
                  </div>
                  <span class="text-sm font-medium text-gray-700 hidden sm:block">
                    {{ auth.currentUser()?.name }}
                  </span>
                  <span class="text-xs text-gray-400">▾</span>
                </button>

                <!-- Dropdown -->
                @if (menuOpen()) {
                  <div class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg
                              border border-gray-100 py-1 z-50">
                    <div class="px-4 py-2 border-b border-gray-100">
                      <p class="text-xs text-gray-500">Conectado como</p>
                      <p class="text-sm font-semibold text-gray-800 truncate">
                        {{ auth.currentUser()?.email }}
                      </p>
                    </div>

                    @if (auth.isAdmin()) {
                      <a routerLink="/admin"
                         (click)="menuOpen.set(false)"
                         class="block px-4 py-2 text-sm text-gray-700
                                hover:bg-gray-50 transition-colors">
                        Panel Admin
                      </a>
                      <a routerLink="/admin/gallery"
                        (click)="menuOpen.set(false)"
                        class="block px-4 py-2 text-sm text-gray-700
                                hover:bg-gray-50 transition-colors">
                        Galería
                      </a>
                    }

                    <a routerLink="/guest/reservations"
                       (click)="menuOpen.set(false)"
                       class="block px-4 py-2 text-sm text-gray-700
                              hover:bg-gray-50 transition-colors">
                      Mis Reservas
                    </a>

                    <button
                      (click)="logout()"
                      class="w-full text-left px-4 py-2 text-sm text-red-600
                             hover:bg-red-50 transition-colors">
                      Cerrar Sesión
                    </button>
                  </div>
                }
              </div>
            } @else {
              <!-- No logueado -->
              <a routerLink="/auth/login"
                 class="text-sm text-gray-600 hover:text-primary-600
                        transition-colors font-medium">
                Iniciar Sesión
              </a>
              <a routerLink="/auth/register"
                 class="text-sm bg-primary-500 hover:bg-primary-600 text-white
                        px-4 py-2 rounded-lg transition-colors font-medium">
                Registrarse
              </a>
            }

            <!-- Menú mobile -->
            <button
              (click)="mobileOpen.set(!mobileOpen())"
              class="md:hidden p-2 text-gray-600 hover:text-primary-600">
              ☰
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        @if (mobileOpen()) {
          <div class="md:hidden border-t border-gray-100 py-3 flex flex-col gap-2">
            <a routerLink="/hotels"
               (click)="mobileOpen.set(false)"
               class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
              Hoteles
            </a>
            @if (auth.isLoggedIn()) {
              <a routerLink="/guest/reservations"
                 (click)="mobileOpen.set(false)"
                 class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                Mis Reservas
              </a>
            }
            @if (auth.isAdmin()) {
              <a routerLink="/admin"
                 (click)="mobileOpen.set(false)"
                 class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                Admin
              </a>
            }
          </div>
        }
      </div>
    </nav>
  `
})
export class NavbarComponent {
  auth = inject(AuthService);
  menuOpen = signal(false);
  mobileOpen = signal(false);

  logout() {
    this.menuOpen.set(false);
    this.auth.logout();
  }
}