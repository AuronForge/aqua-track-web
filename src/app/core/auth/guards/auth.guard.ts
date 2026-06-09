import { inject } from '@angular/core';
import { CanActivateChildFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

function redirectToLogin(): UrlTree {
  return inject(Router).createUrlTree(['/login']);
}

export const authCanMatchGuard: CanMatchFn = () => {
  const authService = inject(AuthService);

  if (authService.hasAccess()) {
    return true;
  }

  return redirectToLogin();
};

export const authCanActivateChildGuard: CanActivateChildFn = () => {
  const authService = inject(AuthService);

  if (authService.hasAccess()) {
    return true;
  }

  return redirectToLogin();
};
