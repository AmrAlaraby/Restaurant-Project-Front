import { Component, Input } from '@angular/core';
import { OrderInterface } from '../../../../../Core/Models/OrderModels/order-interface';
import { TranslatePipe } from '@ngx-translate/core';
// import { OrderInterface } from '../../../../Core/Models/OrderModels/order-interface';

@Component({
  selector: 'app-order-stats',
  imports: [TranslatePipe],
  templateUrl: './order-stats.html',
  styleUrl: './order-stats.scss',
})
export class OrderStats {
 @Input() orders: OrderInterface[] = [];

  get total() {
    return this.orders.length;
  }

  get delivered() {
    return this.orders.filter(o => o.status === 'Delivered').length;
  }

  get preparing() {
    return this.orders.filter(o => o.status === 'Preparing').length;
  }

  get cancelled() {
    return this.orders.filter(o => o.status === 'Cancelled').length;
  }
}
