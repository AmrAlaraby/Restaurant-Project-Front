import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaiterOrderFilters } from '../../components/waiter-order/waiter-order-filters/waiter-order-filters';
import { OrderFilters } from '../../../../Core/Models/OrderModels/waiter-order.model';


@Component({
  selector: 'app-waiter-orders-page',
  standalone: true,
  imports: [CommonModule, WaiterOrderFilters],
  templateUrl: './waiter-orders-page.html',
  styleUrls: ['./waiter-orders-page.scss'],
})
export class WaiterOrdersPage {
  onFiltersChanged(filters: OrderFilters) {
    console.log('Filters:', filters);
  }
}
