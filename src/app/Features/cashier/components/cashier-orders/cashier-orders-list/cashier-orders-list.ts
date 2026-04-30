import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashierOrder } from '../../../../../Core/Models/OrderModels/cashier-order.model';



@Component({
  selector: 'app-cashier-orders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cashier-orders-list.html',
  styleUrls: ['./cashier-orders-list.scss']
})
export class CashierOrdersList {

  @Input() orders: CashierOrder[] = [];

  @Output() orderClicked = new EventEmitter<number>();
  @Output() payClicked = new EventEmitter<number>();
  @Output() assignClicked = new EventEmitter<number>();

  onOrderClick(orderId: number) {
    this.orderClicked.emit(orderId);
  }

  onPay(orderId: number, event: Event) {
    event.stopPropagation();
    this.payClicked.emit(orderId);
  }

  onAssign(orderId: number, event: Event) {
    event.stopPropagation();
    this.assignClicked.emit(orderId);
  }

  isDelivery(type: string): boolean {
    return type === 'Delivery';
  }

isPending(status?: string): boolean {
  return status === 'Pending' || status === 'AwaitingPayment';
}

  formatStatus(text?: string): string {
    if (!text) return '';

    return text
      .replace(/([a-z])([A-Z])/g, '$1 $2') // AwaitingPayment → Awaiting Payment
      .replace('Pending', 'Pending'); // optional future tweak
  }
}
