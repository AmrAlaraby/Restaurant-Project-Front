import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { KitchenBoardDto } from '../../../../Core/Models/KitchenModels/kitchen-board-dto';
import { OrderKitchenTicketDTO } from '../../../../Core/Models/KitchenModels/order-kitchen-ticket-dto';
import { TicketStatus } from '../../../../Core/Models/KitchenModels/ticket-status';
import { KitchenService } from '../../../../Core/Services/Kitchen-Service/kitchen-service';
import { KitchenTicketCard } from '../../components/kitchen-ticket-card/kitchen-ticket-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kitchen',
  imports: [CommonModule, KitchenTicketCard],
  templateUrl: './kitchen.html',
  styleUrl: './kitchen.scss',
})
export class Kitchen implements OnInit, OnDestroy {
  private kitchenService = inject(KitchenService);

  board!: KitchenBoardDto;
  loading = true;
  private refreshInterval: any;

  ngOnInit(): void {
    this.loadBoard();
    // Auto-refresh every 30 seconds
    this.refreshInterval = setInterval(() => this.loadBoard(), 30000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadBoard() {
    this.loading = true;
    this.kitchenService.getBoard({}).subscribe({
      next: (res) => {
        this.board = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  onStatusChange(ticketId: number, status: TicketStatus) {
    console.log('Sending to API:', ticketId, status);

    this.kitchenService.updateTicketStatus(ticketId, { status }).subscribe({
      next: (res) => {
        console.log('Updated successfully:', res);
        this.loadBoard();
      },
      error: (err) => {
        console.error('Update failed:', err);
      },
    });
  }

  trackById(index: number, item: OrderKitchenTicketDTO) {
    return item.id;
  }

  get readyTickets(): OrderKitchenTicketDTO[] {
    return this.board?.done ?? [];
  }

  get preparingTickets(): OrderKitchenTicketDTO[] {
    return this.board?.preparing ?? [];
  }
}
