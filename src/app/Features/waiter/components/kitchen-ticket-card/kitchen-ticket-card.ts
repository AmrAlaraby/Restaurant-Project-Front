import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { OrderKitchenTicketDTO } from '../../../../Core/Models/KitchenModels/order-kitchen-ticket-dto';
import { TicketStatus } from '../../../../Core/Models/KitchenModels/ticket-status';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kitchen-ticket-card',
  imports: [CommonModule],
  templateUrl: './kitchen-ticket-card.html',
  styleUrl: './kitchen-ticket-card.scss',
})
export class KitchenTicketCard implements OnInit, OnDestroy {
  @Input() ticket!: OrderKitchenTicketDTO;

  @Output() changeStatus = new EventEmitter<{
    id: number;
    status: TicketStatus;
  }>();

  TicketStatus = TicketStatus;

  // Optimistic local status — updates instantly on click before API responds
  localStatus: TicketStatus | null = null;

  get currentStatus(): TicketStatus {
    return this.localStatus ?? this.ticket.status;
  }

  elapsedSeconds = 0;
  private timerInterval: any;

  // Station emoji map
  private stationEmojis: Record<string, string> = {
    pizza: '🍕',
    salads: '🥗',
    grill: '🥩',
    drinks: '🥤',
    sushi: '🍣',
    pasta: '🍝',
  };

  ngOnInit(): void {
    if (this.ticket.startedAt) {
      const start = new Date(this.ticket.startedAt).getTime();
      this.elapsedSeconds = Math.floor((Date.now() - start) / 1000);
      this.timerInterval = setInterval(() => {
        this.elapsedSeconds++;
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  get stationEmoji(): string {
    const key = this.ticket.station?.toLowerCase() ?? '';
    return this.stationEmojis[key] ?? '🍽️';
  }

  get statusLabel(): string {
    switch (this.currentStatus) {
      case TicketStatus.Done:
        return 'READY — SERVE NOW!';
      case TicketStatus.Preparing:
        return 'PREPARING';
      default:
        return 'PENDING';
    }
  }

  get timerDisplay(): string {
    const m = Math.floor(this.elapsedSeconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (this.elapsedSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  get cardClass(): string {
    switch (this.currentStatus) {
      case TicketStatus.Done:
        return 'card--ready';
      case TicketStatus.Preparing:
        return 'card--preparing';
      default:
        return 'card--pending';
    }
  }

  get isReady(): boolean {
    return this.currentStatus === TicketStatus.Done;
  }

  get isPreparing(): boolean {
    return this.currentStatus === TicketStatus.Preparing;
  }

  get isPending(): boolean {
    return this.currentStatus === TicketStatus.Pending;
  }

  markPreparing() {
    this.localStatus = TicketStatus.Preparing; // instant UI update
    this.changeStatus.emit({ id: this.ticket.id, status: TicketStatus.Preparing });
  }

  markDone() {
    if (this.currentStatus !== TicketStatus.Preparing) return;

    this.localStatus = TicketStatus.Done;
    this.changeStatus.emit({
      id: this.ticket.id,
      status: TicketStatus.Done,
    });
  }
}
