import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaiterOrderFilters } from '../../components/waiter-order/waiter-order-filters/waiter-order-filters';
import { WaiterOrdersList } from '../../components/waiter-order/waiter-orders-list/waiter-orders-list';
import { WaiterOrder, OrderFilters } from '../../../../Core/Models/OrderModels/waiter-order.model';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';
import { Pagination } from '../../../../Shared/Components/pagination/pagination';
import { OrderDetails } from '../../../admin/components/Order/order-details/order-details';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { Router } from '@angular/router';
import { SignalRService } from '../../../../Core/Services/SignalR-Service/SignalrService';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-waiter-orders-page',
  standalone: true,
  imports: [
    CommonModule,
    WaiterOrderFilters,
    WaiterOrdersList,
    Pagination,
    OrderDetails,
    TranslatePipe
  ],
  templateUrl: './waiter-orders-page.html',
  styleUrls: ['./waiter-orders-page.scss']
})
export class WaiterOrdersPage implements OnInit {

  private ordersService = inject(OrdersService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private signalR = inject(SignalRService);

  orders: WaiterOrder[] = [];

  totalCount = 0;
  selectedOrderId: number | null = null;
  isModalOpen = false;

  filters: OrderFilters = {
    pageIndex: 1,
    pageSize: 10,
    status: null,
    orderType: 'DineIn' 
  };

  ngOnInit() {
    this.loadCurrentUser();
    this.listenToOrderUpdates();
  }

  listenToOrderUpdates() {
    let token = this.authService.getAccessToken();
    this.signalR.startRestaurantUpdatesConnection(token ?? "");

    this.signalR.onRestaurantUpdate("OrderCreated", (data) => {
      if (
        this.filters.pageIndex === 1 &&
        (!this.filters.orderType || this.filters.orderType === data.orderType)
      ) {
        this.orders.unshift(data);

        if (this.orders.length > this.filters.pageSize) {
          this.orders.pop();
        }
      }

      this.totalCount++;
    });

    this.signalR.onRestaurantUpdate("OrderUpdated", (data) => {
      let index = this.orders.findIndex(o => o.id === data.id);
      if (index !== -1) {
        this.orders[index] = data;
      }
    });

    this.signalR.onRestaurantUpdate("OrderCancelled", (data) => {
      let index = this.orders.findIndex(o => o.id === data.id);
      if (index !== -1) {
        this.orders[index] = data;
      }
    });
  }

  onFiltersChanged(filters: OrderFilters) {
    this.filters = {
      ...filters,
      branchId: this.filters.branchId,
      orderType: 'DineIn' // 
    };

    this.loadOrders();
  }

  private loadOrders() {
    this.ordersService.getAllOrdersForWaiter(this.filters)
      .subscribe({
        next: (res) => {
          this.orders = res.data;
          this.totalCount = res.count;
        },
        error: (err) => {
          console.error('Error loading orders:', err);
        }
      });
  }

  private loadCurrentUser() {
    this.authService.getCurrentUser()
      .subscribe({
        next: (user) => {

          if (!user.branchId) {
            console.error('User has no branchId');
            return;
          }

          this.filters.branchId = user.branchId;
          this.filters.orderType = 'DineIn'; 

          this.loadOrders();
        },
        error: (err) => {
          console.error('Error loading user:', err);
        }
      });
  }

  onOrderClicked(orderId: number) {
    this.selectedOrderId = orderId;
    this.isModalOpen = true;
  }

  onAddItemClicked(orderId: number) {
    this.selectedOrderId = orderId;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedOrderId = null;
    this.loadOrders();
  }

  onPageChanged(page: number) {
    this.filters.pageIndex = page;
    this.loadOrders();
  }

  goToNewOrder() {
    this.router.navigate(['/waiter/place-order']);
  }
}