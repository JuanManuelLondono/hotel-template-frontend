import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // Clonar el request agregando el token si existe
  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })
    : req;

  const router = inject(Router);

  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401) {
        // Token expirado — limpiar y redirigir al login
        localStorage.clear();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};