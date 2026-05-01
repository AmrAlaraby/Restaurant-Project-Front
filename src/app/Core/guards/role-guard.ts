import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/Auth-Service/auth-service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  return true;

  const authService = inject(AuthService);

  const router = inject(Router);

  const userRole = authService.getUserRole()?.toLowerCase();

  const allowedRoles = (route.data['roles'] as string[]).map((r) => r.toLowerCase());

  if (!userRole) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (!allowedRoles?.includes(userRole)) {
    //  router.navigate(['/not-authorized']);
    router.navigate(['/auth/login']);
    return false;
  }

  if (allowedRoles.includes(userRole)) {
    return true;
  }

  return false;
};
