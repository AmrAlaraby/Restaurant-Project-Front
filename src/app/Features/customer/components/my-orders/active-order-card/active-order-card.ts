import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-active-order-card',
  imports: [CommonModule],
  templateUrl: './active-order-card.html',
  styleUrl: './active-order-card.scss',
})
export class ActiveOrderCard {
  order = input.required<any>();
  track = output<number>();



getStepIndex(status: string): number {
  const map: Record<string, number> = {
    Received: 0,
    Preparing: 1,
    Ready: 2,
    Delivered: 3,
  };
  return map[status] ?? 0;
}

get steps(): string[] {
  const type = this.order().orderType;
  if (type === 'Pickup' || type === 'DineIn') {
    return ['Received', 'Preparing', 'Ready', 'Delivered'];
  }
  return ['Received', 'Preparing', 'On the Way', 'Delivered'];
}

getStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    Received:       'badge-confirmed',
    Preparing:      'badge-pending',
    Ready:          'badge-onway',
    Delivered:      'badge-delivered',
    Cancelled:      'badge-cancelled',
    AwaitingPayment:'badge-pending',
  };
  return map[status] ?? '';
}

  onTrack() {
    this.track.emit(this.order().id);
  }
}
