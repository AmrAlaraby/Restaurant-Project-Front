import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { OrderKitchenTicketDTO } from '../../../../Core/Models/KitchenModels/order-kitchen-ticket-dto';
import { TicketStatus } from '../../../../Core/Models/KitchenModels/ticket-status';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-kitchen-ticket-card',
  imports: [CommonModule,TranslatePipe],
  templateUrl: './kitchen-ticket-card.html',
  styleUrl: './kitchen-ticket-card.scss',
})
export class KitchenTicketCard implements OnInit, OnDestroy {
  ngOnInit(): void {
    // Nothing to initialise for this presentational card
  }
  ngOnDestroy(): void {
    // No subscriptions or timers to clean up
  }
  @Input() ticket!: OrderKitchenTicketDTO;

  // Emits the ticket id up to the parent to handle the API call & list removal
  @Output() confirmServed = new EventEmitter<number>();

  confirming = false;

  // Station emoji map
  private stationEmojis: Record<string, string> = {
    pizza: '🍕',
    salads: '🥗',
    grill: '🥩',
    drinks: '🥤',
    sushi: '🍣',
    pasta: '🍝',
  };

  get stationEmoji(): string {
    const key = this.ticket.station?.toLowerCase() ?? '';
    return this.stationEmojis[key] ?? '🍽️';
  }

  onConfirmServed() {
    if (this.confirming) return;
    this.confirming = true;
    this.confirmServed.emit(this.ticket.id);
  }
}
