import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  const spinner = inject(NgxSpinnerService);
  let token: string | null = null;
  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('Token');
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
      });
  return next(modifiedReq).pipe(finalize(() => spinner.hide()));
};
