import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const user = localStorage.getItem('squadup_user');

  if (user) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
