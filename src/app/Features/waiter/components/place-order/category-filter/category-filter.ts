import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../../../Core/Models/CategoryModels/Category ';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-category-filter',
  imports: [TranslatePipe],
  templateUrl: './category-filter.html',
  styleUrl: './category-filter.scss',
})
export class CategoryFilter {
  @Input() categories: Category[] = [];
  @Input() selectedCategoryId?: number;

  @Output() select = new EventEmitter<number | undefined>();

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

  onSelect(categoryId?: number): void {
    this.selectedCategoryId = categoryId;
    this.select.emit(categoryId);
  }

  isActive(categoryId?: number): boolean {
    return this.selectedCategoryId === categoryId;
  }

  getCategoryName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.arabicName || item.name;
    }
    return item.name;
  }
}
