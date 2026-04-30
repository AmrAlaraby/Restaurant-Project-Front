import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchStockInterface } from '../../../../../Core/Models/BranchStockModels/BranchStockInterface';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'app-chef-available-stock',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './chef-available-stock.html',
  styleUrl: './chef-available-stock.scss',
})
export class ChefAvailableStockComponent {
  @Input() stocks: BranchStockInterface[] = [];

  constructor(private localizationService: LocalizationService) {}
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
    if (!item.lowThreshold || item.lowThreshold === 0) return 100;
    const full = item.lowThreshold * 3;
    return Math.min((item.quantityAvailable / full) * 100, 100);
  }

  getBarColor(item: BranchStockInterface): string {
    const pct = this.getBarPercent(item);
    if (pct <= 33) return '#C41E1E';
    if (pct <= 60) return '#F5A623';
    return '#2E9E5B';
  }
  getIngredientName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.ingredientArabicName || item.ingredientName;
    }
    return item.ingredientName;
  }
}
