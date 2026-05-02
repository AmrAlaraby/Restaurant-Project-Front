import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryService } from '../../../../../Core/Services/Delivery-Service/delivery-service';
import { ToastService } from '../../../../../Core/Services/Toast-Service/toast-service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'app-own-deliveries',
  standalone: true,
  imports: [CommonModule,TranslatePipe],
  templateUrl: './own-deliveries.html',
  styleUrls: ['./own-deliveries.scss'],
})
export class OwnDeliveries implements OnInit {
  deliveries: any[] = [];
  loading = false;

  constructor(private deliveryService: DeliveryService,
    private toast: ToastService,
    private localizationService: LocalizationService,
  ) {}

  ngOnInit(): void {
    this.loadOwnDeliveries();
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

  loadOwnDeliveries() {
    this.loading = true;

    this.deliveryService.getOwnAssignedDeliveries().subscribe({
      next: (res) => {
        this.deliveries = res;
        this.loading = false;
      },
      error: (err) => {
         this.toast.error('Failed to load own deliveries');
        console.error(err);
        this.loading = false;
       
      },
    });
  }

  getItemName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.menuItemArabicName || item.menuItemName;
    }
    return item.menuItemName;
  }
  getBranchName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.branchArabicName || item.branchName;
    }
    return item.branchName;
  }
}
