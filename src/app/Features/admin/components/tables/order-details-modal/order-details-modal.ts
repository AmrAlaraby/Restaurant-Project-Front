import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { TableOrderInterface } from '../../../../../Core/Models/TableModels/table-order-interface';
import { DeliveryService } from '../../../../../Core/Services/Delivery-Service/delivery-service';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-order-details-modal',
  imports: [FormsModule,TranslatePipe],
  standalone: true,
  templateUrl: './order-details-modal.html',
  styleUrls: ['./order-details-modal.scss'],
})
export class OrderDetailsModal {
  private deliveryService = inject(DeliveryService);
  @Input() isOpen = false;
  @Input() order: TableOrderInterface | null = null;

  @Output() close = new EventEmitter<void>();
  updateModel = {
  status: '',
  cashCollected: 0
};

  constructor(private localizationService: LocalizationService) {}
  CurrentLanguage: string = 'en';

  ngOnInit(): void {
    this.getCurrentLanguage();
  }

  private destroy$ = new Subject<void>();
    getCurrentLanguage(): void {
      this.CurrentLanguage = this.localizationService.getCurrentLang();
      this.localizationService.currentLang$
    .pipe(takeUntil(this.destroy$))
    .subscribe(lang => {
      this.CurrentLanguage = lang;
    });
    }

    ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClose() {
    this.close.emit();
  }
  updateOrderStatus(status: string) {
  if (!this.order) return;

  this.deliveryService.updateStatus(this.order.id, {
    status: status
  }).subscribe({
    next: (res) => {
      console.log('Status updated');
    },
    error: (err) => {
      console.error(err);
    }
  });
}

    getItemName(item: any): string {
      console.log(item);
      
    if (this.CurrentLanguage === 'ar') {
     return item.arabicName || item.name;
    }
    return item.name;
  }
}
