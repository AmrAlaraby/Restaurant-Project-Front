import { Component, Input } from '@angular/core';
import { MenuItemInterface } from '../../../../../../Core/Models/MenuItemModels/menu-item-interface';
import { BasketService } from '../../../../../../Core/Services/Basket-Service/baskets-service';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../../Core/Services/Localization-Service/localization-service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-menu-item-card',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './customer-menu-item-card.html',
  styleUrls: ['./customer-menu-item-card.scss'],
})
export class CustomerMenuItemCard {

  @Input() item!: MenuItemInterface;

  constructor(private localizationService: LocalizationService,private basketService: BasketService) { }

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

  addToCart(item: MenuItemInterface) {
    this.basketService.addItem({
      id: item.id,
      name: item.name,
      pictureUrl: item.imageUrl,
      price: item.price,
      quantity: 1
    });
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