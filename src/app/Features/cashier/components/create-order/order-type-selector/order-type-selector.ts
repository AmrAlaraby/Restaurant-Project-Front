import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderType } from '../../../../../Core/Models/OrderModels/waiter-order.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-order-type-selector',
  imports: [TranslatePipe],
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
