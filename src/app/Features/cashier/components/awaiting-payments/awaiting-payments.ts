import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CashierOrder } from '../../../../Core/Models/OrderModels/cashier-order.model';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { Pagination } from "../../../../Shared/Components/pagination/pagination";
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-awaiting-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination, TranslatePipe],
  templateUrl: './awaiting-payments.html',
  styleUrl: './awaiting-payments.scss',
})
export class AwaitingPayments implements OnInit {

  orders: CashierOrder[] = [];
  searchText = '';
  selectedOrderId!: number;
  pageIndex = 1;
  pageSize = 10;
  totalCount = 0;

  private branchId!: number;

  @Output() onSelect = new EventEmitter<number>();

  constructor(
    private orderService: OrdersService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    this.authService.getCurrentUser().subscribe(user => {
      this.branchId = user.branchId;

      this.loadOrders();

      this.route.queryParams.subscribe(params => {
        const orderId = params['orderId'];

        if (orderId) {
          this.searchText = orderId.toString();
        }
      });

    });

  }

  loadOrders() {
    this.orderService.getAllOrdersForCashier({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      paymentStatus: 'Pending',
      branchId: this.branchId,
      // search: this.searchText
    }).subscribe(res => {
      this.orders = res.data;
      this.totalCount = res.count;
    });
  }

  onPageChanged(page: number) {
    this.pageIndex = page;
    this.loadOrders();
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
  if (order.orderType === 'DineIn') {
    return 'CASHIER.PAYMENT.AWAITING_PAYMENTS.LABELS.TABLE';
  }

  if (order.orderType === 'Delivery') {
    return 'CASHIER.PAYMENT.AWAITING_PAYMENTS.LABELS.DELIVERY';
  }

  return 'CASHIER.PAYMENT.AWAITING_PAYMENTS.LABELS.ORDER';
}

  select(orderId: number) {
    this.selectedOrderId = orderId;
    this.onSelect.emit(orderId);
  }
}