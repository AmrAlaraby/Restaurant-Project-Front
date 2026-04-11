import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderKitchenTicketDTO } from '../../../Core/Models/KitchenModels/order-kitchen-ticket-dto';
import { TicketStatus } from '../../../Core/Models/KitchenModels/ticket-status';


@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-card.html',
  styleUrls: ['./ticket-card.scss'],
})
export class TicketCardComponent {
  @Input() ticket!: OrderKitchenTicketDTO;
  @Output() statusUpdate = new EventEmitter<{ ticketId: number; status: TicketStatus }>();
  @Output() viewDetails = new EventEmitter<number>();

  TicketStatus = TicketStatus;

  get nextStatus(): TicketStatus | null {
    if (this.ticket.status === TicketStatus.Pending) return TicketStatus.Preparing;
    if (this.ticket.status === TicketStatus.Preparing) return TicketStatus.Done;
    return null;
  }

  get nextStatusLabel(): string {
    if (this.ticket.status === TicketStatus.Pending) return 'Start Preparing';
    if (this.ticket.status === TicketStatus.Preparing) return 'Mark Done';
    return '';
  }

  get statusLabel(): string {
    switch (this.ticket.status) {
      case TicketStatus.Pending: return 'PENDING';
      case TicketStatus.Preparing: return 'PREPARING';
      case TicketStatus.Done: return 'DONE';
      default: return '';
    }
  }

  get elapsedMinutes(): number | null {
    if (!this.ticket.startedAt) return null;
    const start = new Date(this.ticket.startedAt).getTime();
    const end = this.ticket.completedAt
      ? new Date(this.ticket.completedAt).getTime()
      : Date.now();
    return Math.floor((end - start) / 60000);
  }

  onAdvance(): void {
    if (this.nextStatus !== null) {
      this.statusUpdate.emit({ ticketId: this.ticket.id, status: this.nextStatus });
    }
  }

  onDetails(): void {
    this.viewDetails.emit(this.ticket.id);
  }
}
