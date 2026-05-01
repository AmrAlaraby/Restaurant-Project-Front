import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'app-active-order-card',
  imports: [CommonModule,TranslatePipe],
  templateUrl: './active-order-card.html',
  styleUrl: './active-order-card.scss',
})
export class ActiveOrderCard {
  order = input.required<any>();
  track = output<number>();

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



getStepIndex(status: string): number {
  const map: Record<string, number> = {
    Received: 0,
    Preparing: 1,
    Ready: 2,
    Delivered: 3,
  };
  return map[status] ?? 0;
}

get steps(): string[] {
  const type = this.order().orderType;

  if (type === 'Pickup' || type === 'DineIn') {
    return ['Received', 'Preparing', 'Ready', 'Delivered'];
  }

  return ['Received', 'Preparing', 'OnTheWay', 'Delivered'];
}

getStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    Received:       'badge-confirmed',
    Preparing:      'badge-pending',
    Ready:          'badge-onway',
    Delivered:      'badge-delivered',
    Cancelled:      'badge-cancelled',
    AwaitingPayment:'badge-pending',
  };
  return map[status] ?? '';
}

  onTrack() {
    this.track.emit(this.order().id);
  }

  getItemName(item: any): string {
    
    if (this.CurrentLanguage === 'ar') {
      return item.arabicMenuItemName || item.menuItemName;
    }
    return item.menuItemName;
  }
}
