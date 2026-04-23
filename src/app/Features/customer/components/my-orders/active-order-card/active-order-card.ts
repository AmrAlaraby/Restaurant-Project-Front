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
      Pending: 0,
      Confirmed: 1,
      OnTheWay: 2,
      Delivered: 3,
         Received: 3, 
    };
    return map[status] ?? 0;
  }
  get steps(): string[] {
  const type = this.order().orderType;
  if (type === 'Pickup' || type === 'DineIn') {
    return ['Placed', 'Confirmed', 'Ready', 'Received'];
  }
  return ['Placed', 'Confirmed', 'On the Way', 'Delivered'];
}

  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      Delivered: 'badge-delivered',
      Cancelled: 'badge-cancelled',
      OnTheWay: 'badge-onway',
      Confirmed: 'badge-confirmed',
      Pending: 'badge-pending',
       Received: 'badge-delivered',
    };
    return map[status] ?? '';
  }

  onTrack() {
    this.track.emit(this.order().id);
  }
}
