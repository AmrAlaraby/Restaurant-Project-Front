import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { KitchenBoardDto } from '../../../../Core/Models/KitchenModels/kitchen-board-dto';
import { OrderKitchenTicketDTO } from '../../../../Core/Models/KitchenModels/order-kitchen-ticket-dto';
import { TicketStatus } from '../../../../Core/Models/KitchenModels/ticket-status';
import { KitchenService } from '../../../../Core/Services/Kitchen-Service/kitchen-service';
import { KitchenTicketCard } from '../../components/kitchen-ticket-card/kitchen-ticket-card';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-kitchen',
  imports: [CommonModule, KitchenTicketCard,TranslatePipe
  ],
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

  onConfirmServed(ticketId: number) {
    // Optimistically remove from list immediately
    this.board.done = this.board.done.filter((t) => t.id !== ticketId);

    this.kitchenService.confirmServed(ticketId).subscribe({
      next: () => {
        console.log(`Ticket #${ticketId} confirmed as served.`);
      },
      error: (err) => {
        console.error('Confirm served failed:', err);
        // Re-fetch board to restore correct state on failure
        this.loadBoard();
      },
    });
  }

  trackById(index: number, item: OrderKitchenTicketDTO) {
    return item.id;
  }
}
