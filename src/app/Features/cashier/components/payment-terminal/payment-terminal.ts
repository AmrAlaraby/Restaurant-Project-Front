import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';
import { PaymentService } from '../../../../Core/Services/Payment-Service/payment-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-terminal',
  imports: [FormsModule, CommonModule, TranslatePipe],
  templateUrl: './payment-terminal.html',
  styleUrl: './payment-terminal.scss',
})
export class PaymentTerminal implements OnChanges {

  @Input() orderId!: number;
  @Output() paymentConfirmed = new EventEmitter<void>();

  order: any;
  amountReceived: number = 0;
  isLoading = false;
  paymentSuccess = false;

  constructor(
    private orderService: OrdersService,
    private paymentService: PaymentService
  ) {}

  ngOnChanges() {
    if (this.orderId) {
      this.loadOrder();
      this.amountReceived = 0;
      this.paymentSuccess = false;
    } else {
      this.order = null;
      this.paymentSuccess = false;
    }
  }

  loadOrder() {
    this.orderService.getOrderById(this.orderId).subscribe(res => {
      this.order = res;
    });
  }

  // Payment method comes from backend via order.payment.paymentMethod
  get isCash(): boolean {
    return this.order?.payment?.paymentMethod === 'Cash';
  }

  // Change Due = money received from customer - order total
  get change(): number {
    if (!this.order) return 0;
    return this.amountReceived - this.order.totalAmount;
  }

  confirmPayment() {
    if (!this.order) return;
    this.isLoading = true;

    const method = this.order?.payment?.paymentMethod;

    if (method === 'Cash') {

      this.paymentService.confirmCash(this.orderId, this.order.totalAmount).subscribe({
        
        next: () => this.handleSuccess(),
        error: () => { this.isLoading = false; }
        
      });


    } else if (method === 'Card') {

      this.paymentService.pay(this.orderId).subscribe({
        next: (res) => {
          window.open(res.iframeUrl, '_blank');
          this.handleSuccess();
        },
        error: () => { this.isLoading = false; }
      });

    } else {
      // InstaPay / Wallet — نفس منطق الـ cash (بدّل لو عندك endpoint مختلف)
      this.paymentService.confirmCash(this.orderId, this.order.totalAmount).subscribe({
        next: () => this.handleSuccess(),
        error: () => { this.isLoading = false; }
      });
    }
  }

  private handleSuccess() {
    
    if (this.order?.payment) {
      this.order.payment.paymentStatus = 'Paid';
      this.order.payment.paidAmount = this.amountReceived;
    }
    this.order.status = 'Paid';

    this.isLoading = false;
    this.paymentSuccess = true;

    // بعد 3 ثواني ابعت event للـ parent عشان يعمل reload للأوردرات
    setTimeout(() => {
      this.paymentConfirmed.emit();
    }, 3000);
  }

  issueRefund() {
    alert('Refund flow not implemented yet.');
  }
}