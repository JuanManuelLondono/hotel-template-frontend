import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-primary text-white">
      <div class="max-w-7xl mx-auto px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10">

          <!-- Brand -->
          <div class="md:col-span-1">
            <p class="font-headline text-xl font-bold tracking-tighter mb-6 uppercase
                      tracking-widest">
              HotelTemplate
            </p>
            <p class="font-body text-xs text-white/50 leading-loose mb-6">
              Redefiniendo la hospitalidad a través de experiencias únicas
              y servicio de clase mundial.
            </p>
          </div>

          <!-- Navegación -->
          <div>
            <h4 class="font-body text-xs uppercase tracking-widest font-bold
                       text-white mb-6">
              Navegación
            </h4>
            <ul class="flex flex-col gap-4">
              @for (link of links; track link.label) {
                <li>
                  <a [routerLink]="link.path"
                     class="font-body text-xs uppercase tracking-widest text-white/50
                            hover:text-gold transition-colors underline-offset-4
                            hover:underline">
                    {{ link.label }}
                  </a>
                </li>
              }
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h4 class="font-body text-xs uppercase tracking-widest font-bold
                       text-white mb-6">
              Legal
            </h4>
            <ul class="flex flex-col gap-4">
              <li>
                <a href="#"
                   class="font-body text-xs uppercase tracking-widest text-white/50
                          hover:text-gold transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#"
                   class="font-body text-xs uppercase tracking-widest text-white/50
                          hover:text-gold transition-colors">
                  Términos de Servicio
                </a>
              </li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div>
            <h4 class="font-body text-xs uppercase tracking-widest font-bold
                       text-white mb-6">
              Contacto
            </h4>
            <p class="font-body text-xs text-white/50 mb-4 tracking-widest uppercase">
              Mantente informado
            </p>
            <div class="flex items-center gap-2 border-b border-white/20 py-2">
              <input
                type="email"
                placeholder="TU EMAIL"
                class="bg-transparent border-none text-xs tracking-widest p-0
                       focus:ring-0 w-full placeholder-white/30 text-white
                       outline-none"/>
              <button class="text-white/50 hover:text-gold transition-colors text-sm">
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-white/10">
        <div class="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row
                    justify-between items-center gap-4">
          <p class="font-body text-xs uppercase tracking-widest text-white/30">
            © {{ year }} HotelTemplate. Todos los derechos reservados.
          </p>
          <p class="font-body text-xs uppercase tracking-widest text-white/30">
            Diseñado con elegancia · Colombia
          </p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  year = new Date().getFullYear();

  links = [
    { path: '/',       label: 'Inicio' },
    { path: '/hotels', label: 'Hoteles' },
    { path: '/auth/login',    label: 'Iniciar Sesión' },
    { path: '/auth/register', label: 'Registrarse' },
  ];
}