import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'app-bill-preview',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './bill-preview.html',
  styleUrl: './bill-preview.scss',
})
export class BillPreview implements OnChanges {

  @Input() orderId!: number;
  order: any;

  constructor
  (
    private orderService: OrdersService,
    private localizationService: LocalizationService,
  ) {}

  ngOnChanges() {
    if (this.orderId) {
      this.orderService.getOrderById(this.orderId).subscribe(res => {
        this.order = res;
      });
    } else {
      this.order = null;
    }
  }

  getTableLabel(): string {
  const o = this.order;
  if (!o) return '';

  if (o.orderType === 'DineIn') {
    return 'CASHIER.PAYMENT.BILL_PREVIEW.LABELS.TABLE';
  }

  if (o.orderType === 'Delivery') {
    return 'CASHIER.PAYMENT.BILL_PREVIEW.LABELS.DELIVERY';
  }

  if (o.orderType === 'Pickup') {
    return 'CASHIER.PAYMENT.BILL_PREVIEW.LABELS.PICKUP';
  }

  return 'CASHIER.PAYMENT.BILL_PREVIEW.LABELS.ORDER';
}

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

  getStatusClass(): string {
    const s = this.order?.status?.toLowerCase();
    const map: Record<string, string> = {
      ready: 'badge-ready',
      awaitingpayment: 'badge-awaiting',
      paid: 'badge-paid',
      preparing: 'badge-preparing',
      delivered: 'badge-delivered',
      cancelled: 'badge-cancelled',
    };
    return map[s] ?? 'badge-default';
  }

  getMethodIcon(): string {
    const map: Record<string, string> = {
      Cash: '💵',
      Card: '💳',
      InstaPay: '📱',
      Wallet: '👛',
    };
    return map[this.order?.payment?.paymentMethod] ?? '';
  }

  getItemName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.arabicMenuItemName || item.menuItemName;
    }
    return item.menuItemName;
  }
}