import { Component, inject, OnInit } from '@angular/core';
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
export class Kitchen implements OnInit {
  private kitchenService = inject(KitchenService);

  board!: KitchenBoardDto;
  loading = true;

  ngOnInit(): void {
    this.loadBoard();
  }

  loadBoard() {
    this.loading = true;

    this.kitchenService.getBoard({}).subscribe({
      next: (res) => {
        this.board = res;
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  onStatusChange(ticketId: number, status: TicketStatus) {
    this.kitchenService.updateTicketStatus(ticketId, { status }).subscribe({
      next: () => {
        this.loadBoard(); // refresh board after update
      },
      error: (err) => console.log(err),
    });
  }

  trackById(index: number, item: OrderKitchenTicketDTO) {
    return item.id;
  }
}
