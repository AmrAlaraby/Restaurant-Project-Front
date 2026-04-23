import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders-table',
  imports: [CommonModule],
  templateUrl: './orders-table.html',
  styleUrl: './orders-table.scss',
})
export class OrdersTable {
  orders = input.required<any[]>();
  reorder = output<number>();

  getTypeBadgeClass(type: string): string {
    const map: Record<string, string> = {
      Delivery: 'badge-delivery',
      DineIn: 'badge-dinein',
      Pickup: 'badge-pickup',
    };
    return map[type] ?? '';
  }

  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      Delivered: 'badge-delivered',
      Cancelled: 'badge-cancelled',
      OnTheWay: 'badge-onway',
      Confirmed: 'badge-confirmed',
      Pending: 'badge-pending',
    };
    return map[status] ?? '';
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  }

  onReorder(orderId: number) {
    this.reorder.emit(orderId);
  }
}
