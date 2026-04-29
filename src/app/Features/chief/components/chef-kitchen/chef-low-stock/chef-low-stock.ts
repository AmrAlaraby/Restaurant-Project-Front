import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchStockInterface } from '../../../../../Core/Models/BranchStockModels/BranchStockInterface';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';
import { ToastService } from '../../../../../Core/Services/Toast-Service/toast-service';

@Component({
  selector: 'app-chef-low-stock',
  standalone: true,
  imports: [CommonModule,TranslatePipe],
  templateUrl: './chef-low-stock.html',
  styleUrl: './chef-low-stock.scss'
})
export class ChefLowStockComponent {

  @Input() stocks: BranchStockInterface[] = [];

  requestSent = false;

  constructor(
          private localizationService: LocalizationService,
          private toast: ToastService
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

  getBarPercent(item: BranchStockInterface): number {
    if (!item.lowThreshold || item.lowThreshold === 0) return 0;
    const full = item.lowThreshold * 3;
    return Math.min((item.quantityAvailable / full) * 100, 100);
  }

  requestRestock(): void {
    this.requestSent = true;
    this.toast.success('Restock request sent!');
    setTimeout(() => (this.requestSent = false), 3000);
  }
  getIngredientName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.ingredientArabicName || item.ingredientName;
    }
    return item.ingredientName;
  }
}
