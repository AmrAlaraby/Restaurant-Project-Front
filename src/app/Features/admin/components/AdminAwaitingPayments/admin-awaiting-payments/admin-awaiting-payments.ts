import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslatePipe } from '@ngx-translate/core';
import { BranchDto } from '../../../../../Core/Models/BranchModels/Branch-dto';
import { CashierOrder } from '../../../../../Core/Models/OrderModels/cashier-order.model';
import { BranchService } from '../../../../../Core/Services/Branch-Service/branch-service';
import { OrdersService } from '../../../../../Core/Services/Orders-Service/orders-service';
import { Pagination } from '../../../../../Shared/Components/pagination/pagination';

@Component({
  selector: 'app-admin-awaiting-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination, TranslatePipe],
  templateUrl: './admin-awaiting-payments.html',
  styleUrl: './admin-awaiting-payments.scss',
})
export class AdminAwaitingPayments implements OnInit {

  orders: CashierOrder[] = [];
  branches: BranchDto[] = [];

  searchText = '';
  selectedOrderId!: number;
  selectedBranchId: number | null = null;

  pageIndex = 1;
  pageSize = 10;
  totalCount = 0;

  @Output() onSelect = new EventEmitter<number>();

  constructor(
    private orderService: OrdersService,
    private branchService: BranchService,
  ) {}

  ngOnInit() {
    this.loadBranches();
    this.loadOrders();
  }

  loadBranches() {
    this.branchService.getBranches().subscribe(branches => {
      this.branches = branches;
    });
  }

  loadOrders() {
    this.orderService.getAllOrdersForCashier({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      paymentStatus: 'Pending',
      ...(this.selectedBranchId ? { branchId: this.selectedBranchId } : {}),
    }).subscribe(res => {
      this.orders = res.data;
      this.totalCount = res.count;
    });
  }

  onBranchChange() {
    this.pageIndex = 1;
    this.loadOrders();
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

  getBranchName(branchId: number): string {
    return this.branches.find(b => b.id === branchId)?.name ?? '';
  }

  select(orderId: number) {
    this.selectedOrderId = orderId;
    this.onSelect.emit(orderId);
  }
}
