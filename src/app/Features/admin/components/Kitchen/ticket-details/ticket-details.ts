import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KitchenTicketDetailsDto } from '../../../../../Core/Models/KitchenModels/kitchen-ticket-details-dto';
import { TicketStatus } from '../../../../../Core/Models/KitchenModels/ticket-status';

@Component({
  selector: 'app-ticket-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-details.html',
  styleUrls: ['./ticket-details.scss'],
})
export class TicketDetailsModalComponent {
  @Input() ticket!: KitchenTicketDetailsDto;
  @Output() close = new EventEmitter<void>();
  @Output() statusUpdate = new EventEmitter<{ ticketId: number; status: TicketStatus }>();

  TicketStatus = TicketStatus;

  get statusLabel(): string {
    switch (this.ticket.status) {
      case TicketStatus.Pending: return 'PENDING';
      case TicketStatus.Preparing: return 'PREPARING';
      case TicketStatus.Done: return 'DONE';
      default: return '';
    }
  }

  get nextStatus(): TicketStatus | null {
    if (this.ticket.status === TicketStatus.Pending) return TicketStatus.Preparing;
    if (this.ticket.status === TicketStatus.Preparing) return TicketStatus.Done;
    return null;
  }

  get nextStatusLabel(): string {
    if (this.ticket.status === TicketStatus.Pending) return 'Start Preparing';
    if (this.ticket.status === TicketStatus.Preparing) return 'Mark as Done';
    return '';
  }

  onAdvance(): void {
    if (this.nextStatus !== null) {
      this.statusUpdate.emit({ ticketId: this.ticket.id, status: this.nextStatus });
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
