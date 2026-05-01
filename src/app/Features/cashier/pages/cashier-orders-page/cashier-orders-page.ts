import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaiterOrderFilters } from '../../../waiter/components/waiter-order/waiter-order-filters/waiter-order-filters';
import { Pagination } from '../../../../Shared/Components/pagination/pagination';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';
import { CashierOrder } from '../../../../Core/Models/OrderModels/cashier-order.model';
import { OrderFilters } from '../../../../Core/Models/OrderModels/waiter-order.model';
import { Router } from '@angular/router';
import { CashierOrdersList } from '../../components/cashier-orders/cashier-orders-list/cashier-orders-list';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { SignalRService } from '../../../../Core/Services/SignalR-Service/SignalrService';
import { DeliveryService } from '../../../../Core/Services/Delivery-Service/delivery-service';
import { TranslatePipe } from '@ngx-translate/core';
import { OrderDetails } from "../../../admin/components/Order/order-details/order-details";


@Component({
  selector: 'app-cashier-orders-page',
  standalone: true,
  imports: [CommonModule, WaiterOrderFilters, Pagination, CashierOrdersList, TranslatePipe, OrderDetails],
  templateUrl: './cashier-orders-page.html',
  styleUrls: ['./cashier-orders-page.scss'],
})
export class CashierOrdersPage implements OnInit {
  private ordersService = inject(OrdersService);
  private authService = inject(AuthService);
  private DeliveryService = inject(DeliveryService);
  //--------- For navigation -------------
  private router = inject(Router);
  private signalR = inject(SignalRService);
  goToNewOrder() {
    this.router.navigate(['/cashier/create-order']);
  }

  orders: CashierOrder[] = [];
  totalCount = 0;

  filters: OrderFilters = {
    pageIndex: 1,
    pageSize: 10,
    status: null,
    orderType: null,
  };

  selectedOrderId: number | null = null;
  isModalOpen = false;

  private loadCurrentUser() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (!user.branchId) {
          console.error('No branchId for user');
          return;
        }

        this.filters.branchId = user.branchId;

        this.loadOrders(); // 👈 بعد ما نحط البرانش
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  ngOnInit() {
    this.loadCurrentUser();
    this.listenToOrderUpdates();
  }

  onFiltersChanged(filters: OrderFilters) {
    this.filters = {
      ...filters,
      branchId: this.filters.branchId,
    };

    this.loadOrders();
  }

  private loadOrders() {
    this.ordersService.getAllOrdersForCashier(this.filters).subscribe({
      next: (res) => {
        this.orders = res.data;
        this.totalCount = res.count;
        //check if order type is delivery and status is not cancelled or delivered then get order`s delivery status from delivery service
        this.orders.forEach((order) => {
          if (
            order.orderType === 'Delivery' &&
            order.status !== 'Cancelled' &&
            order.status !== 'Delivered'
          ) {
            this.DeliveryService.getAll(1, 100, { orderId: order.id }).subscribe({
              next: (res) => {
                const delivery = res.data?.find((d: any) => d.order?.id === order.id);
                if (delivery) {
                  order.deliveryStatus = delivery.deliveryStatus;
                  console.log(order);

                }
              },
            });
          }
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  listenToOrderUpdates() {
    let token = this.authService.getAccessToken();
    this.signalR.startRestaurantUpdatesConnection(token ?? '');

    this.signalR.onRestaurantUpdate('OrderCreated', (data) => {
      if (
        this.filters.pageIndex === 1 &&
        (!this.filters.orderType || this.filters.orderType === data.orderType)
      ) {
        this.orders.unshift(data);
        //remove last item if exceeds page size
        if (this.orders.length > this.filters.pageSize) {
          this.orders.pop();
        }
      }
      this.totalCount++;
    });

    this.signalR.onRestaurantUpdate('OrderUpdated', (data) => {
      let index = this.orders.findIndex((o) => o.id === data.id);
      if (index !== -1 && index) {
        this.orders[index] = data;
      }
    });
    this.signalR.onRestaurantUpdate('OrderCancelled', (data) => {
      let index = this.orders.findIndex((o) => o.id === data.id);
      if (index !== -1 && index) {
        this.orders[index] = data;
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

  onPayClicked(orderId: number) {
    this.router.navigate(['/cashier/payments'], {
      queryParams: { orderId }
    });
  }

  onAssignClicked(orderId: number) {
    this.router.navigate(['/cashier/assign-deliveries'], {
      queryParams: { orderId }
    });
  }
}
