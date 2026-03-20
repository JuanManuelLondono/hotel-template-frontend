import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-secondary-900 text-white mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

          <!-- Logo y descripción -->
          <div>
            <div class="flex items-center gap-2 mb-4">
              <span class="text-2xl">🏨</span>
              <span class="font-serif text-xl font-bold text-white">
                HotelTemplate
              </span>
            </div>
            <p class="text-secondary-300 text-sm leading-relaxed">
              Tu destino de lujo y confort. Reserva tu estadía perfecta con nosotros.
            </p>
          </div>

          <!-- Links -->
          <div>
            <h3 class="font-semibold text-white mb-4">Navegación</h3>
            <ul class="flex flex-col gap-2">
              <li>
                <a routerLink="/"
                   class="text-secondary-300 hover:text-white text-sm transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a routerLink="/hotels"
                   class="text-secondary-300 hover:text-white text-sm transition-colors">
                  Hoteles
                </a>
              </li>
              <li>
                <a routerLink="/auth/login"
                   class="text-secondary-300 hover:text-white text-sm transition-colors">
                  Iniciar Sesión
                </a>
              </li>
            </ul>
          </div>

          <!-- Contacto -->
          <div>
            <h3 class="font-semibold text-white mb-4">Contacto</h3>
            <ul class="flex flex-col gap-2 text-secondary-300 text-sm">
              <li>📧 contacto&#64;hoteltemplate.com</li>
              <li>📞 +57 1 234 5678</li>
              <li>📍 Colombia</li>
            </ul>
          </div>
        </div>

        <div class="border-t border-secondary-700 mt-8 pt-8 text-center">
          <p class="text-secondary-400 text-sm">
            © {{ year }} HotelTemplate. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  year = new Date().getFullYear();
}