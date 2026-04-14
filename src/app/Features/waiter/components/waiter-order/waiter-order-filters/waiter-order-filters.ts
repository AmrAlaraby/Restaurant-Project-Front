import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { OrderFilters, OrderStatus, OrderType } from '../../../../../Core/Models/OrderModels/waiter-order.model';


@Component({
  selector: 'app-waiter-order-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './waiter-order-filters.html',
  styleUrls: ['./waiter-order-filters.scss'],
})
export class WaiterOrderFilters {
  private fb = inject(FormBuilder);

  @Output() filtersChanged = new EventEmitter<OrderFilters>();

  form = this.fb.group({
    status: [null as OrderStatus | null],
    orderType: [null as OrderType | null],
  });

  statuses: OrderStatus[] = ['Received', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];
  types: OrderType[] = ['DineIn', 'Delivery', 'Pickup'];

  ngOnInit() {
    this.emitFilters();
  }

  onChange() {
    this.emitFilters();
  }

  private emitFilters() {
    this.filtersChanged.emit({
      pageIndex: 1,
      pageSize: 10,
      status: this.form.value.status,
      orderType: this.form.value.orderType,
    });
  }
}
