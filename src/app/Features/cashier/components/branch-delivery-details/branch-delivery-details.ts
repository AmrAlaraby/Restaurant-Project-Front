import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryService } from '../../../../Core/Services/Delivery-Service/delivery-service';
import { Delivery } from '../../../../Core/Models/DeliveryModels/delivery';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'app-branch-delivery-details',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './branch-delivery-details.html',
  styleUrls: ['./branch-delivery-details.scss'],
})
export class BranchDeliveryDetails implements OnInit {

  @Input() deliveryId!: number;
  @Output() back = new EventEmitter<void>();

  delivery?: Delivery;
  loading = false;

  constructor(
    private service: DeliveryService,
    private localizationService: LocalizationService,
  ) {}

  ngOnInit(): void {
    this.load();
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

  load(): void {
    this.loading = true;
    this.service.getById(this.deliveryId).subscribe({
      next: (res) => {
        this.delivery = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  goBack(): void {
    this.back.emit();
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
