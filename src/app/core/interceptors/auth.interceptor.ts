import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { catchError, finalize, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  let spinner = inject(NgxSpinnerService);
  const router = inject(Router); // نستخدم Router علشان نرجع لصفحة login

  let token: string | null = null;
  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('Token');
  }
   if (token && isTokenExpired(token)) {
    localStorage.removeItem('Token');
    router.navigate(['/login']);
    spinner.hide();
    return throwError(() => new Error('Token expired'));
  }
  if (req.url.includes('assets/i18n')) {
    return next(req); 
  }

  const baseUrl = 'http://localhost:8080/';
  const isRelativeUrl = !/^http(s)?:\/\//.test(req.url);
  const fullUrl = isRelativeUrl
    ? baseUrl.replace(/\/+$/, '') + '/' + req.url.replace(/^\/+/, '')
    : req.url;

  const noTokenEndpoints = ['/public/login', '/public/register'];
  const isNoTokenRequired = noTokenEndpoints.some(endpoint => fullUrl.includes(endpoint));

  const modifiedReq = isNoTokenRequired
    ? req.clone({ url: fullUrl })  
    : req.clone({
        url: fullUrl,
        setHeaders: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      }
    );
 spinner.show();
  return next(modifiedReq).pipe(
    
    catchError((error) => {
      if (error.status === 401) {
        if (isPlatformBrowser(platformId)) {
          localStorage.removeItem('Token'); 
        }
         if (router.url !== '/login') {
          router.navigate(['/login']);
          
        }
      }
      return throwError(() => error);
    }),
    finalize(() => setTimeout(() => {
       spinner.hide()
    }, 500))
  );
};
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() > payload.exp * 1000;
  } catch {
    return true;
  }
}

