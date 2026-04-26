import { Component } from '@angular/core';
import { AwaitingPayments } from "../../components/awaiting-payments/awaiting-payments";
import { PaymentTerminal } from "../../components/payment-terminal/payment-terminal";
import { BillPreview } from "../../components/bill-preview/bill-preview";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cashier-payment',
  imports: [AwaitingPayments, PaymentTerminal, BillPreview, CommonModule],
  templateUrl: './cashier-payment.html',
  styleUrl: './cashier-payment.scss',
})
export class CashierPayment {

  selectedOrderId!: number;

  onOrderSelected(orderId: number) {
    this.selectedOrderId = orderId;
  }

  onPaymentConfirmed() {
    // بعد الدفع نمسح الـ selection ونعيد تحميل الأوردرات
    this.selectedOrderId = null!;
  }
}