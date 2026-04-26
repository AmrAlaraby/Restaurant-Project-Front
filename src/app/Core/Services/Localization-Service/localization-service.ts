import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  constructor(private translate: TranslateService) {}

  init() {
  const savedLang = localStorage.getItem('lang');

  if (savedLang) {
    this.setLang(savedLang);
    return;
  }

  // detect browser language
const browserLang = navigator.language || navigator.languages?.[0];

const lang = browserLang?.toLowerCase().includes('ar') ? 'ar' : 'en';

  this.setLang(lang);
}

  setLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  getCurrentLang() {
    return this.translate.currentLang;
  }
}
