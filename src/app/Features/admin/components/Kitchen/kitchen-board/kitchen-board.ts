import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { KitchenFilterComponent } from '../kitchen-filter/kitchen-filter';
import { TicketCardComponent } from '../ticket-card/ticket-card';
import { TicketDetailsModalComponent } from '../ticket-details/ticket-details';
import { ActiveStationsBarComponent } from '../active-stations-bar/active-stations-bar';
import { KitchenBoardDto } from '../../../../../Core/Models/KitchenModels/kitchen-board-dto';
import { ActivePendingStationsDTO } from '../../../../../Core/Models/KitchenModels/active-pending-stations-dto';
import { KitchenTicketDetailsDto } from '../../../../../Core/Models/KitchenModels/kitchen-ticket-details-dto';
import { KitchenTicketQueryParams } from '../../../../../Core/Models/KitchenModels/kitchen-ticket-query-params';
import { KitchenService } from '../../../../../Core/Services/Kitchen-Service/kitchen-service';
import { TicketStatus } from '../../../../../Core/Models/KitchenModels/ticket-status';

@Component({
  selector: 'app-kitchen-board',
  standalone: true,
  imports: [
    CommonModule,
    KitchenFilterComponent,
    TicketCardComponent,
    TicketDetailsModalComponent,
    ActiveStationsBarComponent,
  ],
  templateUrl: './kitchen-board.html',
  styleUrls: ['./kitchen-board.scss'],
})
export class KitchenBoardComponent implements OnInit, OnDestroy {

  board: KitchenBoardDto = { pending: [], preparing: [], done: [] };
  stations: ActivePendingStationsDTO[] = [];
  selectedTicket: KitchenTicketDetailsDto | null = null;

  loading = false;
  stationsLoading = false;
  error: string | null = null;

  currentParams: KitchenTicketQueryParams = {
    branchId: null,
    orderId: null,
    station: null,
    status: null,
  };

  private destroy$ = new Subject<void>();

  constructor(private kitchenService: KitchenService) {}

  ngOnInit(): void {
    this.loadBoard(this.currentParams);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =====================
  // Load Board
  // =====================
  loadBoard(params: KitchenTicketQueryParams): void {
    this.loading = true;
    this.error = null;

    const safeParams: KitchenTicketQueryParams = {
      branchId: params.branchId ?? null,
      orderId: params.orderId ?? null,
      station: params.station ?? null,
      status: params.status ?? null,
    };

    this.kitchenService.getBoard(safeParams)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.board = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load tickets.';
          this.loading = false;
        },
      });
  }

  // =====================
  // Reload Stations
  // =====================
  private refreshStations(): void {
    this.stationsLoading = true;

    this.kitchenService.getActiveStations(this.currentParams.branchId ?? null)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.stations = data;
          this.stationsLoading = false;
        },
        error: () => {
          this.stationsLoading = false;
        },
      });
  }

  // =====================
  // Filter
  // =====================
  onFilterChanged(params: KitchenTicketQueryParams): void {
    const safeParams: KitchenTicketQueryParams = {
      branchId: params.branchId ?? null,
      orderId: params.orderId ?? null,
      station: params.station ?? null,
      status: params.status ?? null,
    };

    if (JSON.stringify(safeParams) === JSON.stringify(this.currentParams)) return;

    this.currentParams = safeParams;
    this.loadBoard(safeParams);
  }

  onStationsLoaded(stations: ActivePendingStationsDTO[]): void {
    this.stations = stations;
  }

  // =====================
  // Details
  // =====================
  onViewDetails(ticketId: number): void {
    this.kitchenService.getTicket(ticketId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.selectedTicket = data,
        error: () => this.error = 'Failed to load ticket details.',
      });
  }

  // =====================
  // Status Update
  // =====================
  onStatusUpdate(event: { ticketId: number; status: TicketStatus }): void {
    this.kitchenService.updateTicketStatus(event.ticketId, { status: event.status })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadBoard(this.currentParams);
          this.refreshStations();

          if (this.selectedTicket?.id === event.ticketId) {
            this.selectedTicket = null;
          }
        },
        error: () => {
          this.error = 'Failed to update ticket status.';
        },
      });
  }

  // =====================
  // Modal
  // =====================
  onCloseModal(): void {
    this.selectedTicket = null;
  }

  // =====================
  // Stats
  // =====================
  get totalPending(): number {
    return this.board.pending.length;
  }

  get totalPreparing(): number {
    return this.board.preparing.length;
  }

  get totalDone(): number {
    return this.board.done.length;
  }
}
