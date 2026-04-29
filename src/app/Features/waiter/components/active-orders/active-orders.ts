import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'app-active-orders',
  standalone: true,
  imports: [CommonModule,TranslatePipe],
  templateUrl: './active-orders.html',
  styleUrl: './active-orders.scss',
})
export class ActiveOrders {
  @Input() orders: any[] = [];

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

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      Received:  'blue',
      Preparing: 'orange',
      Ready:     'green',
      Delivered: 'gray',
    };
    return map[status] ?? 'gray';
  }

  // عرض أول 3 items كـ text مختصر
  getPreviewItems(order: any): string[] {
    const items: any[] = order.orderItems ?? [];
    return items.slice(0, 3).map(i => {
      const name = this.getItemName(i) ?? 'Item';
      return `${name} ×${i.quantity}`;
    });
  }

  getItemName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.arabicMenuItemName || item.menuItemName;
    }
    return item.menuItemName;
  }
}