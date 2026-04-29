import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CashierOrder } from '../../../../Core/Models/OrderModels/cashier-order.model';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-awaiting-payments',
  imports: [CommonModule, FormsModule],
  templateUrl: './awaiting-payments.html',
  styleUrl: './awaiting-payments.scss',
})
export class AwaitingPayments implements OnInit {

  orders: CashierOrder[] = [];
  searchText = '';
  selectedOrderId!: number;

  @Output() onSelect = new EventEmitter<number>();

  constructor(private orderService: OrdersService, private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadOrders();

    this.route.queryParams.subscribe(params => {
      const orderId = params['orderId'];

      if (orderId) {
        this.searchText = orderId.toString();
      }
    });
  }


  loadOrders() {
    this.orderService.getAllOrdersForCashier({
      pageIndex: 1,
      pageSize: 20,
      paymentStatus: 'Pending',
     
   
    }).subscribe(res => {
      this.orders = res.data;
    });
  }

  get filteredOrders(): CashierOrder[] {
    if (!this.searchText.trim()) return this.orders;
    const q = this.searchText.toLowerCase();
    return this.orders.filter(o =>
      o.id.toString().includes(q) ||
      o.orderType?.toLowerCase().includes(q)
    );
  }

  getOrderLabel(order: CashierOrder): string {
    
    if (order.orderType === 'DineIn') return `Table ${order.orderType ?? ''}`;
    if (order.orderType === 'Delivery') return 'Delivery';
    return order.orderType ?? 'Order';
  }

  select(orderId: number) {
    this.selectedOrderId = orderId;
    this.onSelect.emit(orderId);
  }
}