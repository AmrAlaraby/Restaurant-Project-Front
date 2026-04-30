import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateOrderItemInterface } from '../../../../../Core/Models/OrderModels/create-order-item-interface';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'app-order-summary',
  imports: [CommonModule,TranslatePipe],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.scss',
})
export class OrderSummary {

  @Input() items: any[] = [];
  @Input() total = 0;

  @Output() remove = new EventEmitter<number>();
  @Output() decrease = new EventEmitter<number>();

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

      getItemName(item: any): string {
        console.log(item);
        
    if (this.CurrentLanguage === 'ar') {
      return item.arabicName || item.name;
    }
    return item.name;
  }
}
