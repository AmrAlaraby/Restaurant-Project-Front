import { Component, ViewChild } from '@angular/core';

import { PaymentTerminal } from '../../../../cashier/components/payment-terminal/payment-terminal';
import { BillPreview } from '../../../../cashier/components/bill-preview/bill-preview';

import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AdminAwaitingPayments } from '../../../components/AdminAwaitingPayments/admin-awaiting-payments/admin-awaiting-payments';
import { RecentTransactionsComponent } from '../../../components/Payment/recent-transactions/recent-transactions';

@Component({
  selector: 'app-admin-payment',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    AdminAwaitingPayments,
    PaymentTerminal,
    BillPreview,
    RecentTransactionsComponent,
  ],
  templateUrl: './admin-payment.html',
  styleUrl: './admin-payment.scss',
})
export class AdminPayment {

  @ViewChild(AdminAwaitingPayments) awaitingPayments!: AdminAwaitingPayments;

  selectedOrderId!: number;

  onOrderSelected(orderId: number) {
    this.selectedOrderId = orderId;
  }

  onPaymentConfirmed() {
    this.selectedOrderId = null!;
    this.awaitingPayments.loadOrders();
  }
}
