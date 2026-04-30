import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaiterOrder } from '../../../../../Core/Models/OrderModels/waiter-order.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-waiter-orders-list',
  standalone: true,
  imports: [CommonModule,TranslatePipe],
  templateUrl: './waiter-orders-list.html',
  styleUrls: ['./waiter-orders-list.scss'],
})
export class WaiterOrdersList {
  @Input() orders: WaiterOrder[] = [];

  @Output() orderClicked = new EventEmitter<number>();
  @Output() addItemClicked = new EventEmitter<number>();

  onOrderClick(orderId: number) {
    this.orderClicked.emit(orderId);
  }

  onAddItem(orderId: number, event: Event) {
    event.stopPropagation(); 
    this.addItemClicked.emit(orderId);
  }

  isReceived(status: string): boolean {
    return status === 'Received';
  }

  onViewClick(orderId: number, event: Event) {
  event.stopPropagation();
  this.onOrderClick(orderId);
}

getRowClass(status: string): string {
  switch (status) {
    case 'Delivered':
      return 'row-delivered';
    case 'Cancelled':
      return 'row-cancelled';
    case 'Preparing':
      return 'row-preparing';
    default:
      return '';
  }
}
}
