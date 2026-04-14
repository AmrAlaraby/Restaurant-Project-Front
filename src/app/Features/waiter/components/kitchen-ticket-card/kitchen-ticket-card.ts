import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderKitchenTicketDTO } from '../../../../Core/Models/KitchenModels/order-kitchen-ticket-dto';
import { TicketStatus } from '../../../../Core/Models/KitchenModels/ticket-status';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kitchen-ticket-card',
  imports: [CommonModule],
  templateUrl: './kitchen-ticket-card.html',
  styleUrl: './kitchen-ticket-card.scss',
})
export class KitchenTicketCard {
  @Input() ticket!: OrderKitchenTicketDTO;

  @Output() changeStatus = new EventEmitter<{
    id: number;
    status: TicketStatus;
  }>();

  TicketStatus = TicketStatus;

  markPreparing() {
    this.changeStatus.emit({
      id: this.ticket.id,
      status: TicketStatus.Preparing,
    });
  }

  markDone() {
    this.changeStatus.emit({
      id: this.ticket.id,
      status: TicketStatus.Done,
    });
  }
}
