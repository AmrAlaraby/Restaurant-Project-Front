import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaiterOrderFilters } from '../../../waiter/components/waiter-order/waiter-order-filters/waiter-order-filters';
import { Pagination } from '../../../../Shared/Components/pagination/pagination';
import { OrderDetails } from '../../../admin/components/Order/order-details/order-details';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';
import { CashierOrder } from '../../../../Core/Models/OrderModels/cashier-order.model';
import { OrderFilters } from '../../../../Core/Models/OrderModels/waiter-order.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cashier-orders-page',
  standalone: true,
  imports: [
    CommonModule,
    WaiterOrderFilters,
    Pagination,
    OrderDetails
  ],
  templateUrl: './cashier-orders-page.html',
  styleUrls: ['./cashier-orders-page.scss']
})
export class CashierOrdersPage implements OnInit {

  private ordersService = inject(OrdersService);

//--------- For navigation -------------
private router = inject(Router);
goToNewOrder() {
  this.router.navigate(['/cashier/create-order']);
}

  orders: CashierOrder[] = [];
  totalCount = 0;

  filters: OrderFilters = {
    pageIndex: 1,
    pageSize: 10,
    status: null,
    orderType: null
  };

  selectedOrderId: number | null = null;
  isModalOpen = false;

  ngOnInit() {
    this.loadOrders();
  }

  onFiltersChanged(filters: OrderFilters) {
    this.filters = {
      ...filters
    };

    this.loadOrders();
  }

  private loadOrders() {
    this.ordersService.getAllOrdersForCashier(this.filters)
      .subscribe({
        next: (res) => {
          this.orders = res.data;
          this.totalCount = res.count;
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  onPageChanged(page: number) {
    this.filters.pageIndex = page;
    this.loadOrders();
  }

  onOrderClicked(orderId: number) {
    this.selectedOrderId = orderId;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedOrderId = null;
    this.loadOrders(); // refresh
  }
}