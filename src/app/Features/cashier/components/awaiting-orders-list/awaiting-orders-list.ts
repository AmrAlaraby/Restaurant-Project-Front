import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../../../../../src/app/Core/Services/Orders-Service/orders-service';

export interface DashboardOrder {
  id: number;
  orderType: string;
  userName: string;
  totalAmount: number;
  paymentMethod?: string;
  previewItems: { emoji: string; name: string; quantity: number }[];
  extraLabel?: string;  // e.g. 'COD'
}

@Component({
  selector: 'app-awaiting-orders-list',
  imports: [CommonModule],
  templateUrl: './awaiting-orders-list.html',
  styleUrl: './awaiting-orders-list.scss',
})
export class AwaitingOrdersListComponent implements OnInit {

  @Output() onPayNow = new EventEmitter<number>();

  orders: DashboardOrder[] = [];
  loading = true;

  private emojiMap: Record<string, string> = {
    pizza: '🍕', salad: '🥗', juice: '🥤',
    burger: '🍔', pasta: '🍝', soup: '🍜',
  };

  constructor(private orderService: OrdersService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getAllOrdersForCashier({
      pageIndex: 1,
      pageSize: 20,
      status: 'AwaitingPayment',
    }).subscribe({
      next: res => {
        // getOrderById لكل أوردر عشان نجيب الـ items
        const rawOrders = res.data ?? [];
        let loaded = 0;

        if (rawOrders.length === 0) {
          this.loading = false;
          return;
        }

        rawOrders.forEach(o => {
          this.orderService.getOrderById(o.id).subscribe(detail => {
            const items = (detail as any).orderItems ?? [];
            this.orders.push({
              id: o.id,
              orderType: o.orderType,
              userName: o.userName ?? '',
              totalAmount: (detail as any).totalAmount ?? 0,
              paymentMethod: (detail as any).payment?.paymentMethod,
              previewItems: items.slice(0, 3).map((item: any) => ({
                emoji: this.getEmoji(item.menuItemName ?? item.name ?? ''),
                name: item.menuItemName ?? item.name ?? '',
                quantity: item.quantity,
              })),
              extraLabel: o.orderType === 'Delivery' ? 'COD' : undefined,
            });
            loaded++;
            if (loaded === rawOrders.length) {
              this.loading = false;
            }
          });
        });
      },
      error: () => { this.loading = false; }
    });
  }

  getTypeIcon(order: DashboardOrder): string {
    const map: Record<string, string> = {
      DineIn: '💳', Delivery: '🚴', Pickup: '🧳',
    };
    return map[order.paymentMethod ?? ''] ?? (order.orderType === 'Delivery' ? '🚴' : '💳');
  }

  getTypeLabel(order: DashboardOrder): string {
    if (order.orderType === 'DineIn') return `Table ${order.id}`; // بدّلي بـ tableNumber الحقيقي
    return order.orderType;
  }

  getCardClass(order: DashboardOrder): string {
    if (order.orderType === 'Delivery') return 'card-blue';
    return 'card-red';
  }

  getActionLabel(order: DashboardOrder): string {
    if (order.orderType === 'Delivery') return 'Assign Driver';
    return 'Pay Now';
  }

  getActionClass(order: DashboardOrder): string {
    if (order.orderType === 'Delivery') return 'btn-outline';
    return 'btn-primary';
  }

  onAction(order: DashboardOrder) {
    if (order.orderType !== 'Delivery') {
      this.onPayNow.emit(order.id);
    }
    // Delivery → implement assign driver logic
  }

  private getEmoji(name: string): string {
    const lower = name.toLowerCase();
    for (const [key, emoji] of Object.entries(this.emojiMap)) {
      if (lower.includes(key)) return emoji;
    }
    return '🍽️';
  }
}