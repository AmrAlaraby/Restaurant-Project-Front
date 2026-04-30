import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecentTransaction } from '../../pages/cashier-dashboard/cashier-dashboard';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-recent-transactions',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './recent-transactions.html',
  styleUrl: './recent-transactions.scss',
})
export class RecentTransactionsComponent {
  @Input() transactions: RecentTransaction[] = [];

  getMethodIcon(method: string): string {
    const map: Record<string, string> = {
      Cash: '💵', Card: '💳', InstaPay: '📱', Wallet: '👛',
    };
    return map[method] ?? '💰';
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      Paid: 'pill-paid',
      Pending: 'pill-pending',
      Failed: 'pill-failed',
      Refunded: 'pill-refunded',
    };
    return map[status] ?? 'pill-default';
  }
}