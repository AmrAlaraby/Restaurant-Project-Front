import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { OrdersService } from '../../../../../../src/app/Core/Services/Orders-Service/orders-service';
import { Pagination } from "../../../../Shared/Components/pagination/pagination";
import { Router } from '@angular/router';

export interface DashboardOrder {
  id: number;
  orderType: string;
  userName: string;
  totalAmount: number;
  paymentMethod?: string;
  previewItems: { emoji: string; name: string; quantity: number }[];
  extraLabel?: string;
}

@Component({
  selector: 'app-awaiting-orders-list',
  standalone: true,
  imports: [CommonModule, Pagination],
  templateUrl: './awaiting-orders-list.html',
  styleUrl: './awaiting-orders-list.scss',
})
export class AwaitingOrdersListComponent implements OnInit {

  @Output() onPayNow = new EventEmitter<number>();

  orders: DashboardOrder[] = [];
  loading = true;

  // ── Pagination ─────────────────────────────
  pageIndex = 1;
  pageSize = 3;
  totalCount = 0;

  private emojiMap: Record<string, string> = {
    pizza: '🍕',
    salad: '🥗',
    juice: '🥤',
    burger: '🍔',
    pasta: '🍝',
    soup: '🍜',
  };

  constructor(private orderService: OrdersService , private router:Router) {}

  ngOnInit() {
    this.loadOrders();
  }

  // ── Load Orders with Pagination ─────────────
  loadOrders() {
    this.loading = true;
    this.orders = [];

    this.orderService.getAllOrdersForCashier({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      paymentStatus: 'Pending'
    }).subscribe({
      next: res => {
        const rawOrders = res.data ?? [];
        this.totalCount = res.count ?? 0;

        if (rawOrders.length === 0) {
          this.loading = false;
          return;
        }

        const requests = rawOrders.map(o =>
          this.orderService.getOrderById(o.id)
        );

        forkJoin(requests).subscribe({
          next: (details: any[]) => {
            this.orders = details.map((detail: any, index: number) => {
              const o = rawOrders[index];
              const items = detail.orderItems ?? [];

              return {
                id: o.id,
                orderType: o.orderType,
                userName: o.userName ?? '',
                totalAmount: detail.totalAmount ?? 0,
                paymentMethod: detail.payment?.paymentMethod,
                previewItems: items.slice(0, 3).map((item: any) => ({
                  emoji: this.getEmoji(item.menuItemName ?? item.name ?? ''),
                  name: item.menuItemName ?? item.name ?? '',
                  quantity: item.quantity,
                })),
                extraLabel: o.orderType === 'Delivery' ? 'COD' : undefined,
              };
            });

            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // ── Pagination Handler ───────────────────────
  onPageChange(page: number) {
    this.pageIndex = page;
    this.loadOrders();
  }

  // ── Actions ─────────────────────────────────
  onAction(order: DashboardOrder) {
    if (order.orderType === 'Delivery') {
      this.router.navigate(['/cashier/assign-deliveries']);
      return;
    }

    this.onPayNow.emit(order.id);
  }

  // ── UI Helpers ───────────────────────────────
  getTypeIcon(order: DashboardOrder): string {
    const map: Record<string, string> = {
      DineIn: '💳',
      Delivery: '🚴',
      Pickup: '🧳',
    };
    return map[order.paymentMethod ?? ''] ??
      (order.orderType === 'Delivery' ? '🚴' : '💳');
  }

  getTypeLabel(order: DashboardOrder): string {
    if (order.orderType === 'DineIn') return `Table ${order.id}`;
    return order.orderType;
  }

  getCardClass(order: DashboardOrder): string {
    return order.orderType === 'Delivery' ? 'card-blue' : 'card-red';
  }

  getActionLabel(order: DashboardOrder): string {
    return order.orderType === 'Delivery' ? 'Assign Driver' : 'Pay Now';
  }

  getActionClass(order: DashboardOrder): string {
    return order.orderType === 'Delivery' ? 'btn-outline' : 'btn-primary';
  }

  // ── Emoji Mapper ────────────────────────────
  private getEmoji(name: string): string {
    const lower = name.toLowerCase();

    for (const [key, emoji] of Object.entries(this.emojiMap)) {
      if (lower.includes(key)) return emoji;
    }

    return '🍽️';
  }
}