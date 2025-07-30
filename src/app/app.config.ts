import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
NgxSpinnerModule
function translation(http:HttpClient)
{
  return new TranslateHttpLoader(http,'assets/i18n/','.json');
}
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(),provideHttpClient(withFetch(), withInterceptors([authInterceptor])),importProvidersFrom(BrowserAnimationsModule,ToastrModule.forRoot(
    {
  timeOut: 3000,
  positionClass: 'toast-top-right',
  preventDuplicates: true,
  progressBar: true,
  closeButton: true
}
  ) ,TranslateModule.forRoot(
    {
      loader:{
        provide:TranslateLoader,
        useFactory:translation,
        deps:[HttpClient]
      }
    }
  ) ),NgxSpinnerModule]
};
