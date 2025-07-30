import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../Services/Auth/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);

  const router=inject(Router);
  const authService=inject(AuthService)
  let token: string | null = null;
  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('Token');
  }

  if (token) {
    authService.saveUserData();
    return true; 
  } else {
    router.navigate(['/login']);   
    return false;
  }
};
