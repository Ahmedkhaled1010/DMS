import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../Services/Auth/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);

  const router=inject(Router);
  const authService=inject(AuthService)
  let role;
  authService.role.subscribe((res)=>{
    role=res;
  })
  let token: string | null = null;
  console.log(role);
  
  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('Token');
    role=localStorage.getItem("Role")
  }

  if (token &&role!="ADMIN") {
    authService.saveUserData();
    return true; 
  } else {
    router.navigate(['/login']);   
    return false;
  }
};
