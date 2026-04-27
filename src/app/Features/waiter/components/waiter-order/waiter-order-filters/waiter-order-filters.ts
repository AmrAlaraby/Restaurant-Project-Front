
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderFilters, OrderStatus, OrderType } from '../../../../../Core/Models/OrderModels/waiter-order.model';

@Component({
  selector: 'app-waiter-order-filters',
  standalone: true,
  templateUrl: './waiter-order-filters.html',
  styleUrls: ['./waiter-order-filters.scss']
})
export class WaiterOrderFilters {

  @Output() filtersChanged = new EventEmitter<OrderFilters>();
  @Input() hideTypeFilter: boolean = false;
  activeStatus: OrderStatus | null = null;
  activeType: OrderType | null = null;

  statusTabs: { label: string; value: OrderStatus | null }[] = [
    { label: 'All', value: null },
    { label: 'Received', value: 'Received' },
    { label: 'Preparing', value: 'Preparing' },
    { label: 'Ready', value: 'Ready' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];

  typeTabs: { label: string; value: OrderType | null }[] = [
    { label: 'All Types', value: null },
    { label: 'DineIn', value: 'DineIn' },
    { label: 'Delivery', value: 'Delivery' },
    { label: 'Pickup', value: 'PickUp' }
  ];

  selectStatus(status: OrderStatus | null) {
    this.activeStatus = status;
    this.emitFilters();
  }

  selectType(type: OrderType | null) {
    this.activeType = type;
    this.emitFilters();
  }

  private emitFilters() {
    this.filtersChanged.emit({
      pageIndex: 1,
      pageSize: 10,
      status: this.activeStatus,
      orderType: this.hideTypeFilter ? 'DineIn' : this.activeType
    });
  }
}