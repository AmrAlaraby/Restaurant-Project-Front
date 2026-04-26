import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizationService } from '../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'app-lang-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lang-switch.html',
  styleUrls: ['./lang-switch.scss']
})
export class LangSwitchComponent {

  currentLang = 'en';

  constructor(private loc: LocalizationService) {
    this.currentLang = this.loc.getCurrentLang() || 'en';
  }

  toggleLang() {
    const newLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.loc.setLang(newLang);
    this.currentLang = newLang;
  }
}