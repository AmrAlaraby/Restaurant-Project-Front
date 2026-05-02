import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';
import { PaymentService } from '../../../../Core/Services/Payment-Service/payment-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-terminal',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslatePipe],
  templateUrl: './payment-terminal.html',
  styleUrl: './payment-terminal.scss',
})
export class PaymentTerminal implements OnChanges, OnInit {

  @Input() orderId!: number;
  @Output() paymentConfirmed = new EventEmitter<void>();

  order: any;
  amountReceived: number = 0;
  isLoading = false;
  paymentSuccess = false;

  urlOrderId?: number;

  constructor(
    private orderService: OrdersService,
    private paymentService: PaymentService,
    private route: ActivatedRoute
  ) {}

  /* ✅ يحدد الأنهي orderId نستخدمه */
  get activeOrderId(): number {
    return this.orderId || this.urlOrderId!;
  }

  /* ✅ لما الـ Input يتغير */
  ngOnChanges() {
    this.resetState();
    this.tryLoadOrder();
  }

  /* ✅ لما الصفحة تفتح بالـ URL */
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['orderId'];
      if (id) {
        this.urlOrderId = +id;
        this.tryLoadOrder();
      }
    });
  }

  /* ✅ تحميل الأوردر بشكل ذكي */
  tryLoadOrder() {
    const id = this.orderId || this.urlOrderId;

    if (!id) return;

    this.orderService.getOrderById(id).subscribe(res => {
      this.order = res;
      this.resetState();
    });
  }

  /* ✅ reset لأي state قديم */
  resetState() {
    this.amountReceived = 0;
    this.paymentSuccess = false;
    this.isLoading = false;
  }

  get isCash(): boolean {
    return this.order?.payment?.paymentMethod === 'Cash';
  }

  get change(): number {
    if (!this.order) return 0;
    return this.amountReceived - this.order.totalAmount;
  }

  confirmPayment() {
    if (!this.order) return;

    this.isLoading = true;
    const method = this.order?.payment?.paymentMethod;

    if (method === 'Cash') {

      this.paymentService.confirmCash(
        this.activeOrderId,
        this.order.totalAmount
      ).subscribe({
        next: () => this.handleSuccess(),
        error: () => this.isLoading = false
      });

    } else if (method === 'Card') {

      this.paymentService.pay(this.activeOrderId).subscribe({
        next: (res) => {
          window.open(res.iframeUrl, '_blank');
          this.handleSuccess();
        },
        error: () => this.isLoading = false
      });

    } else {
      // InstaPay / Wallet
      this.paymentService.confirmCash(
        this.activeOrderId,
        this.order.totalAmount
      ).subscribe({
        next: () => this.handleSuccess(),
        error: () => this.isLoading = false
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

    setTimeout(() => {
      this.paymentConfirmed.emit();
    }, 3000);
  }

  issueRefund() {
    alert('Refund flow not implemented yet.');
  }
}