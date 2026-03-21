import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastComponent],
  template: `
  <div class="min-h-screen flex flex-col">
    <app-navbar />
    <main class="flex-1 flex flex-col pt-16">
      <router-outlet />
    </main>
    <app-footer />
    <app-toast />
  </div>
`
})
export class App { }