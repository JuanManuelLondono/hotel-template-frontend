import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/public/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'hotels',
    loadComponent: () =>
      import('./features/public/hotel-list/hotel-list.component')
        .then(m => m.HotelListComponent)
  },
  {
    path: 'hotels/:id',
    loadComponent: () =>
      import('./features/public/hotel-detail/hotel-detail.component')
        .then(m => m.HotelDetailComponent)
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./features/auth/register/register.component')
        .then(m => m.RegisterComponent)
  },
  {
    path: 'guest',
    canActivate: [authGuard],
    children: [
      {
        path: 'reservations',
        loadComponent: () =>
          import('./features/guest/my-reservations/my-reservations.component')
            .then(m => m.MyReservationsComponent)
      },
      {
        path: 'reserve/:roomTypeId',
        loadComponent: () =>
          import('./features/guest/make-reservation/make-reservation.component')
            .then(m => m.MakeReservationComponent)
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'hotels',
        loadComponent: () =>
          import('./features/admin/hotels/hotels.component')
            .then(m => m.HotelsComponent)
      },
      {
        path: 'room-types',
        loadComponent: () =>
          import('./features/admin/room-types/room-types.component')
            .then(m => m.RoomTypesComponent)
      },
      {
        path: 'reservations',
        loadComponent: () =>
          import('./features/admin/reservations/reservations.component')
            .then(m => m.ReservationsComponent)
      },
      {
        path: 'reviews',
        loadComponent: () =>
          import('./features/admin/reviews/reviews.component')
            .then(m => m.ReviewsComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];