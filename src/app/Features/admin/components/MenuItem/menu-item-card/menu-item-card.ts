import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MenuItemInterface } from '../../../../../Core/Models/MenuItemModels/menu-item-interface';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';
import { Subject, takeUntil } from 'rxjs';




@Component({
  selector: 'app-menu-item-card',
  standalone: true,
  imports: [CommonModule,TranslatePipe],
  templateUrl: './menu-item-card.html',
  styleUrls: ['./menu-item-card.scss'],
})
export class MenuItemCard {
  @Input({ required: true })
  item!: MenuItemInterface;

  @Input()
  showAdminActions = true;

  @Input()
  showAvailability = true;

  @Input()
  compactMode = false;

  @Output()
  view = new EventEmitter<number>();

  @Output()
  edit = new EventEmitter<number>();

  @Output()
  delete = new EventEmitter<number>();

  @Output()
  toggleAvailability = new EventEmitter<number>();

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

  onView(): void {
    this.view.emit(this.item.id);
  }

  onEdit(): void {
    this.edit.emit(this.item.id);
  }

  onDelete(): void {
    this.delete.emit(this.item.id);
  }

  onToggleAvailability(): void {
    this.toggleAvailability.emit(this.item.id);
  }
  getItemName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.arabicName || item.name;
    }
    return item.name;
  }
  getCategoryName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.categoryArabicName || item.category;
    }
    return item.category;
  }
}
