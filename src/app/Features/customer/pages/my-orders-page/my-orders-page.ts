import { Component, inject, signal } from '@angular/core';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrdersHeader } from "../../components/my-orders/orders-header/orders-header";
import { ActiveOrderCard } from "../../components/my-orders/active-order-card/active-order-card";
import { OrdersTable } from "../../components/my-orders/orders-table/orders-table";
import { OrdersEmptyState } from "../../components/my-orders/orders-empty-state/orders-empty-state";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-my-orders-page',
  imports: [
    FormsModule, 
    CommonModule, 
    OrdersHeader, 
    ActiveOrderCard, 
    OrdersTable, 
    OrdersEmptyState,
    TranslatePipe
  ],
  templateUrl: './my-orders-page.html',
  styleUrl: './my-orders-page.scss',
})
export class MyOrdersPage {
private ordersService = inject(OrdersService);
  private router = inject(Router);
 
  loading = signal(true);
  orders = signal<any[]>([]);
  activeOrder = signal<any | null>(null);
 
  ngOnInit() {
    this.loadOrders();
  }
 
 loadOrders() {
  this.loading.set(true);
  this.ordersService.getMyOrders().subscribe({
    next: (res) => {
      const all = res.data ?? [];
      console.log(all.map((o: any) => ({ id: o.id, status: o.status }))); 
      this.orders.set(all);
      console.log(JSON.stringify(all[0], null, 2));
      const active = all.find(
        (o: any) =>
          o.status !== 'Delivered' &&
          o.status !== 'Cancelled' &&
          o.status !== 'Received'
      );
      this.activeOrder.set(active ?? null);
      this.loading.set(false);
    },
    error: () => this.loading.set(false),
  });
}
  onTrackDelivery(orderId: number) {
  this.router.navigate(['/customer/track-delivery', orderId]);
} 
 
  reorder(orderId: number) {
  
    console.log('Reorder:', orderId);
  }
}
