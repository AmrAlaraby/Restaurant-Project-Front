import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderType } from '../../../../../Core/Models/OrderModels/waiter-order.model';

@Component({
  selector: 'app-order-type-selector',
  imports: [],
  templateUrl: './order-type-selector.html',
  styleUrl: './order-type-selector.scss',
})
export class OrderTypeSelector {
  @Input() type: OrderType = 'DineIn';
  @Output() typeChange = new EventEmitter<OrderType>();

  select(type: OrderType): void {
    this.typeChange.emit(type);
  }
}
