import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MenuItemDetailsInterface } from '../../../../../Core/Models/MenuItemModels/menu-item-details-interface';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';



@Component({
  selector: 'app-menu-item-details',
  standalone: true,
  imports: [CommonModule,TranslatePipe],
  templateUrl: './menu-item-details.html',
  styleUrls: ['./menu-item-details.scss'],
})
export class MenuItemDetails {
  @Input({ required: true })
  menuItem!: MenuItemDetailsInterface;

  showRecipes = false;

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

  toggleRecipes(): void {
    this.showRecipes = !this.showRecipes;
  }
  getItemName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.arabicName || item.name;
    }
    return item.name;
  }
  getCategoryName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.categoryArabicName || item.categoryName;
    }
    return item.categoryName;
  }
  getIngredientName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.ingredientArabicName || item.ingredientName;
    }
    return item.ingredientName;
  }
}
