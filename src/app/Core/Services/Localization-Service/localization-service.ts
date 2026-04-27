import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  constructor(private translate: TranslateService) {}

  currentLang$ = new BehaviorSubject<string>('en');


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
    this.currentLang$.next(lang);
  }

  getCurrentLang() {
    return this.translate.currentLang;
  }
}
