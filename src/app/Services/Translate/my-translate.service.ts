import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MyTranslateService {
  constructor(
    private _TranslateService: TranslateService,
    @Inject(PLATFORM_ID) private platform: object
  ) {
    this._TranslateService.setDefaultLang('en');
    if (isPlatformBrowser(platform)) {
      this.setLanguage();
    }
  }
  setLanguage() {
     if (typeof localStorage !== 'undefined' && typeof document !== 'undefined') {
    const lang = localStorage.getItem('lang') || 'en';

    this._TranslateService.use(lang);

    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
  }
  changeLanguage()
  {
   if (isPlatformBrowser(this.platform)) {
    const lang = localStorage.getItem('lang');
    if (lang=='ar') {
      localStorage.setItem('lang', 'en');
    }
    else if (lang=='en') {
      localStorage.setItem('lang', 'ar');
    }
    
    this.setLanguage();
  }
  }
}
