import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed top-0 w-full z-50 transition-all duration-300"
         [class]="scrolled() || !hasDarkHero()
           ? 'glass shadow-sm'
           : 'bg-transparent'">
      <div class="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

        <!-- Logo -->
        <a routerLink="/"
           class="font-headline text-2xl font-bold tracking-tighter transition-colors">
          <span [class]="isWhiteText ? 'text-white' : 'text-primary'">
            HotelTemplate
          </span>
        </a>

        <!-- Links desktop -->
        <div class="hidden md:flex items-center gap-8">
          @for (link of navLinks; track link.path) {
            <a [routerLink]="link.path"
               routerLinkActive="border-b-2 border-gold font-semibold"
               class="text-sm tracking-wide transition-colors font-body"
               [class]="isWhiteText
                 ? 'text-white/80 hover:text-white'
                 : 'text-primary-500 hover:text-primary'">
              {{ link.label }}
            </a>
          }
          @if (auth.isAdmin()) {
            <a routerLink="/admin"
               routerLinkActive="border-b-2 border-gold font-semibold"
               class="text-sm tracking-wide transition-colors font-body"
               [class]="isWhiteText
                 ? 'text-white/80 hover:text-white'
                 : 'text-primary-500 hover:text-primary'">
              Admin
            </a>
          }
          @if (auth.isLoggedIn()) {
            <a routerLink="/guest/reservations"
               routerLinkActive="border-b-2 border-gold font-semibold"
               class="text-sm tracking-wide transition-colors font-body"
               [class]="isWhiteText
                 ? 'text-white/80 hover:text-white'
                 : 'text-primary-500 hover:text-primary'">
              Mis Reservas
            </a>
          }
        </div>

        <!-- Acciones -->
        <div class="flex items-center gap-4">
          @if (auth.isLoggedIn()) {
            <div class="relative">
              <button
                (click)="menuOpen.set(!menuOpen())"
                class="flex items-center gap-2 px-4 py-2 rounded transition-colors"
                [class]="isWhiteText
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-primary-50 hover:bg-primary-100 text-primary'">
                <div class="w-7 h-7 bg-gold rounded flex items-center justify-center
                            text-primary font-bold text-sm">
                  {{ auth.currentUser()?.name?.charAt(0)?.toUpperCase() }}
                </div>
                <span class="text-sm font-medium hidden sm:block">
                  {{ auth.currentUser()?.name }}
                </span>
                <span class="text-xs opacity-60">▾</span>
              </button>

              @if (menuOpen()) {
                <div class="absolute right-0 mt-2 w-52 bg-white rounded-xl
                            shadow-xl border border-primary-100 py-1 z-50">
                  <div class="px-4 py-3 border-b border-primary-50">
                    <p class="text-xs text-primary-400 uppercase tracking-widest">
                      Conectado como
                    </p>
                    <p class="text-sm font-semibold text-primary truncate mt-0.5">
                      {{ auth.currentUser()?.email }}
                    </p>
                  </div>

                  @if (auth.isAdmin()) {
                    <a routerLink="/admin"
                       (click)="menuOpen.set(false)"
                       class="flex items-center gap-2 px-4 py-2.5 text-sm
                              text-primary-600 hover:bg-primary-50 transition-colors">
                      Panel Admin
                    </a>
                  }

                  <a routerLink="/guest/reservations"
                     (click)="menuOpen.set(false)"
                     class="flex items-center gap-2 px-4 py-2.5 text-sm
                            text-primary-600 hover:bg-primary-50 transition-colors">
                    Mis Reservas
                  </a>

                  <div class="border-t border-primary-50 mt-1">
                    <button
                      (click)="logout()"
                      class="w-full text-left px-4 py-2.5 text-sm text-red-600
                             hover:bg-red-50 transition-colors">
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              }
            </div>

          } @else {
            <a routerLink="/auth/login"
               class="text-sm font-medium transition-colors"
               [class]="isWhiteText
                 ? 'text-white/80 hover:text-white'
                 : 'text-primary-500 hover:text-primary'">
              Iniciar Sesión
            </a>
            <a routerLink="/auth/register"
               class="bg-secondary text-white px-6 py-2 rounded text-sm
                      font-semibold tracking-wide hover:bg-secondary-600
                      transition-colors active:scale-95">
              Reservar
            </a>
          }

          <!-- Mobile toggle -->
          <button
            (click)="mobileOpen.set(!mobileOpen())"
            class="md:hidden p-2 transition-colors"
            [class]="isWhiteText ? 'text-white' : 'text-primary'">
            ☰
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      @if (mobileOpen()) {
        <div class="md:hidden glass border-t border-white/10">
          <div class="px-6 py-4 flex flex-col gap-3">
            @for (link of navLinks; track link.path) {
              <a [routerLink]="link.path"
                 (click)="mobileOpen.set(false)"
                 class="text-sm text-primary-600 py-2 border-b border-primary-50">
                {{ link.label }}
              </a>
            }
            @if (auth.isAdmin()) {
              <a routerLink="/admin"
                 (click)="mobileOpen.set(false)"
                 class="text-sm text-primary-600 py-2 border-b border-primary-50">
                Admin
              </a>
            }
            @if (auth.isLoggedIn()) {
              <a routerLink="/guest/reservations"
                 (click)="mobileOpen.set(false)"
                 class="text-sm text-primary-600 py-2 border-b border-primary-50">
                Mis Reservas
              </a>
              <button (click)="logout()"
                      class="text-sm text-red-600 py-2 text-left">
                Cerrar Sesión
              </button>
            } @else {
              <a routerLink="/auth/login"
                 (click)="mobileOpen.set(false)"
                 class="text-sm text-primary-600 py-2">
                Iniciar Sesión
              </a>
            }
          </div>
        </div>
      }
    </nav>
  `
})
export class NavbarComponent {
  auth       = inject(AuthService);
  private router = inject(Router);

  menuOpen   = signal(false);
  mobileOpen = signal(false);
  scrolled   = signal(false);
  hasDarkHero = signal(false);

  // Solo la home tiene hero oscuro
  private darkHeroRoutes = ['/'];

  navLinks = [
    { path: '/hotels', label: 'Sedes' },
  ];

  // El texto es blanco cuando hay hero oscuro y no se ha scrolleado
  get isWhiteText(): boolean {
    return this.hasDarkHero() && !this.scrolled();
  }

  constructor() {
    if (typeof window !== 'undefined') {

      // Detectar scroll
      window.addEventListener('scroll', () => {
        this.scrolled.set(window.scrollY > 50);
      });

      // Detectar cambio de ruta
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        // Verificar si la ruta actual tiene hero oscuro
        const url = event.urlAfterRedirects ?? event.url;
        this.hasDarkHero.set(this.darkHeroRoutes.includes(url));

        // Cerrar menús al navegar
        this.menuOpen.set(false);
        this.mobileOpen.set(false);

        // Resetear scroll
        window.scrollTo(0, 0);
      });

      // Estado inicial según la ruta actual
      this.hasDarkHero.set(
        this.darkHeroRoutes.includes(this.router.url)
      );
    }
  }

  logout() {
    this.menuOpen.set(false);
    this.auth.logout();
  }
}