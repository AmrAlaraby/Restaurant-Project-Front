import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'app-track-info-grid',
  imports: [TranslatePipe],
  templateUrl: './track-info-grid.html',
  styleUrl: './track-info-grid.scss',
})
export class TrackInfoGrid {
address       = input.required<any>();
  items         = input.required<any[]>();
  totalAmount   = input.required<number>();
  cashCollected = input<number | null>(null);

  constructor(
        private localizationService: LocalizationService,
      ) {}
    ngOnInit(): void {
      this.getCurrentLanguage();
    }
    CurrentLanguage: string = 'en';
    
      private destroy$ = new Subject<void>();
      getCurrentLanguage(): void {
        this.CurrentLanguage = this.localizationService.getCurrentLang();
        this.localizationService.currentLang$.pipe(takeUntil(this.destroy$)).subscribe((lang) => {
          this.CurrentLanguage = lang;
        });
      }
    
      ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
      }

  getItemName(item: any): string {
    
    
    if (this.CurrentLanguage === 'ar') {
      return item.menuItemArabicName || item.menuItemName;
    }
    return item.menuItemName;
  }
}
