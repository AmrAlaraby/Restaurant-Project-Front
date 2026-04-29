import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-active-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-orders.html',
  styleUrl: './active-orders.scss',
})
export class ActiveOrders {
  @Input() orders: any[] = [];

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      Received:  'blue',
      Preparing: 'orange',
      Ready:     'green',
      Delivered: 'gray',
    };
    return map[status] ?? 'gray';
  }

  // عرض أول 3 items كـ text مختصر
  getPreviewItems(order: any): string[] {
    const items: any[] = order.orderItems ?? [];
    return items.slice(0, 3).map(i => {
      const name = i.menuItemName ?? i.name ?? 'Item';
      return `${name} ×${i.quantity}`;
    });
  }
}