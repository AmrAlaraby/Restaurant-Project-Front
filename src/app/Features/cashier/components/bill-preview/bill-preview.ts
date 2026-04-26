import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';

@Component({
  selector: 'app-bill-preview',
  imports: [CommonModule],
  templateUrl: './bill-preview.html',
  styleUrl: './bill-preview.scss',
})
export class BillPreview implements OnChanges {

  @Input() orderId!: number;
  order: any;

  constructor(private orderService: OrdersService) {}

  ngOnChanges() {
    if (this.orderId) {
      this.orderService.getOrderById(this.orderId).subscribe(res => {
        this.order = res;
      });
    } else {
      this.order = null;
    }
  }

  getTableLabel(): string {
    const o = this.order;
    if (!o) return '';
    if (o.orderType === 'DineIn') return `Table ${o.tableOrder?.tableNumber ?? o.tableNumber ?? ''}`;
    if (o.orderType === 'Delivery') return 'Delivery';
    if (o.orderType === 'Pickup') return 'Pickup';
    return o.orderType ?? '';
  }

  getStatusClass(): string {
    const s = this.order?.status?.toLowerCase();
    const map: Record<string, string> = {
      ready: 'badge-ready',
      awaitingpayment: 'badge-awaiting',
      paid: 'badge-paid',
      preparing: 'badge-preparing',
      delivered: 'badge-delivered',
      cancelled: 'badge-cancelled',
    };
    return map[s] ?? 'badge-default';
  }

  getMethodIcon(): string {
    const map: Record<string, string> = {
      Cash: '💵',
      Card: '💳',
      InstaPay: '📱',
      Wallet: '👛',
    };
    return map[this.order?.payment?.paymentMethod] ?? '';
  }
}