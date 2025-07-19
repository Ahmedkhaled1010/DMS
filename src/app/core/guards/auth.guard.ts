import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../Services/Auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const router=inject(Router);
  const authService=inject(AuthService)
    const token = localStorage.getItem('Token');

  if (token) {
    authService.saveUserData();
    return true; 
  } else {
    router.navigate(['/login']);   
    return false;
  }
};
