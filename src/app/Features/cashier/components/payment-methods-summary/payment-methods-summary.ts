import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentMethodSummary } from '../../pages/cashier-dashboard/cashier-dashboard';

@Component({
  selector: 'app-payment-methods-summary',
  imports: [CommonModule],
  templateUrl: './payment-methods-summary.html',
  styleUrl: './payment-methods-summary.scss',
})
export class PaymentMethodsSummaryComponent {
  @Input() summary: PaymentMethodSummary[] = [];

  get maxAmount(): number {
    return Math.max(...this.summary.map(s => s.amount), 1);
  }

  getPercent(m: PaymentMethodSummary): number {
    return Math.round((m.amount / this.maxAmount) * 100);
  }
}