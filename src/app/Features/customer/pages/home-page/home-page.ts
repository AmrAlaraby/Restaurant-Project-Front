import { Component, inject, OnInit } from '@angular/core';
import { CategoryList } from '../../components/Home/category-list/category-list';
import { PopularItems } from '../../components/Home/popular-items/popular-items';
import { Router } from '@angular/router';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';
import { OrderDetailsInterface } from '../../../../Core/Models/OrderModels/order-details-interface';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { SignalRService } from '../../../../Core/Services/SignalR-Service/SignalrService';
import { Delivery } from '../../../../Core/Models/DeliveryModels/delivery';
import { CartBar } from '../../components/cart-bar/cart-bar';

@Component({
  selector: 'app-home-page',
  imports: [CategoryList, PopularItems, CartBar],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit {
  private router = inject(Router);
  private ordersService = inject(OrdersService);
  private authService = inject(AuthService);
  private signalR = inject(SignalRService);

  ActiveOrders: OrderDetailsInterface[] = [];

  ngOnInit(): void {
    this.loadOrders();
    this.listenToOrderUpdates();
  }

  goToBrowse() {
    this.router.navigate(['/customer/browse-menu']);
  }

  loadOrders() {
    const params = { pageNumber: 1, pageSize: 10, OrderType: 'Delivery' };
    this.ordersService.getMyActiveOrders(params).subscribe({
      next: (res) => {
        this.ActiveOrders = res.data ?? [];
      },
    });
  }

  onTrackDelivery(orderId: number) {
    this.router.navigate(['/customer/track-delivery', orderId]);
  }

  listenToOrderUpdates() {
    const token = this.authService.getAccessToken();
    this.signalR.startRestaurantUpdatesConnection(token ?? '');

    this.signalR.onRestaurantUpdate('OrderAssignedToDriver', (data: Delivery | null) => {
      if (data) {
        const index = this.ActiveOrders.findIndex((o) => o.id === data.order.id);
        if (index !== -1 && this.ActiveOrders[index].delivery) {
          this.ActiveOrders[index].delivery.deliveryStatus = data.deliveryStatus;
          this.ActiveOrders[index].delivery.driverName = data.driverName ?? undefined;
        }
      }
    });

    this.signalR.onRestaurantUpdate('deliveryUpdated', (data: Delivery | null) => {
      if (data) {
        const index = this.ActiveOrders.findIndex((o) => o.id === data.order.id);
        if (index !== -1) {
          if (this.ActiveOrders[index].delivery) {
            this.ActiveOrders[index].delivery.deliveryStatus = data.deliveryStatus;
            this.ActiveOrders[index].delivery.driverName = data.driverName ?? undefined;
          }
          if (data.deliveryStatus === 'Delivered') {
            this.ActiveOrders.splice(index, 1);
          }
        }
      }
    });

    this.signalR.onRestaurantUpdate('OrderUpdated', (data) => {
      const index = this.ActiveOrders.findIndex((o) => o.id === data.id);
      if (index !== -1) {
        this.ActiveOrders[index] = data;
      }
      if (data.status === 'Cancelled' || data.status === 'Delivered') {
        this.ActiveOrders.splice(index, 1);
      }
    });
  }
}