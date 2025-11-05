import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const AuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.loggedIn()) return true;
  // Try refresh and re-evaluate later; simple redirect for now
  auth.refreshSession();
  router.navigateByUrl('/login');
  return false;
};

