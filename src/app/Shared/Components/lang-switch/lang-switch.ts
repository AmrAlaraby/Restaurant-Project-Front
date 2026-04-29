import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizationService } from '../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'app-lang-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lang-switch.html',
  styleUrls: ['./lang-switch.scss']
})
export class LangSwitchComponent implements AfterViewInit {
  @ViewChild('slider') slider!: ElementRef<HTMLDivElement>;
  @ViewChild('enSeg') enSeg!: ElementRef<HTMLDivElement>;
  @ViewChild('arSeg') arSeg!: ElementRef<HTMLDivElement>;

  currentLang = 'en';

  constructor(private loc: LocalizationService) {
    this.currentLang = this.loc.getCurrentLang() || 'en';
  }

  ngAfterViewInit() {
    this.updateSlider();
  }

  toggleLang() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.loc.setLang(this.currentLang);
    this.updateSlider();
  }

  private updateSlider() {
    const activeSeg = this.currentLang === 'en'
      ? this.enSeg.nativeElement
      : this.arSeg.nativeElement;

    this.slider.nativeElement.style.width = activeSeg.offsetWidth + 'px';
    this.slider.nativeElement.style.left = activeSeg.offsetLeft + 'px';
  }
}