import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

/** Protege rutas que requieren autenticación. Redirige a /login si no hay sesión. */
export const authGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const token = localStorage.getItem('squadup_token');

  if (token) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
