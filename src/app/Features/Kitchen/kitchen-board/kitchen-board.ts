import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subject, Subscription } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { KitchenBoardDto } from '../../../Core/Models/KitchenModels/kitchen-board-dto';
import { ActivePendingStationsDTO } from '../../../Core/Models/KitchenModels/active-pending-stations-dto';
import { KitchenTicketDetailsDto } from '../../../Core/Models/KitchenModels/kitchen-ticket-details-dto';
import { KitchenTicketQueryParams } from '../../../Core/Models/KitchenModels/kitchen-ticket-query-params';
import { KitchenService } from '../../../Core/Services/Kitchen-Service/kitchen-service';
import { TicketStatus } from '../../../Core/Models/KitchenModels/ticket-status';
import { KitchenFilterComponent } from '../kitchen-filter/kitchen-filter';
import { TicketCardComponent } from '../ticket-card/ticket-card';
import { TicketDetailsModalComponent } from '../ticket-details/ticket-details';
import { ActiveStationsBarComponent } from '../active-stations-bar/active-stations-bar';

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

  currentParams: KitchenTicketQueryParams = {};

  private destroy$ = new Subject<void>();
  private autoRefreshSub?: Subscription;

  AUTO_REFRESH_INTERVAL = 30000; // 30 seconds

  constructor(private kitchenService: KitchenService) {}

  ngOnInit(): void {
    this.loadBoard(this.currentParams);
    this.loadStations();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBoard(params: KitchenTicketQueryParams): void {
    this.loading = true;
    this.error = null;
    this.kitchenService.getBoard(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => { this.board = data; this.loading = false; },
      error: (err) => { this.error = 'Failed to load tickets.'; this.loading = false; },
    });
  }

  loadStations(): void {
    const branchId = this.currentParams.branchId ?? 1;
    this.stationsLoading = true;
    this.kitchenService.getActiveStations(branchId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => { this.stations = data; this.stationsLoading = false; },
      error: () => { this.stationsLoading = false; },
    });
  }

  onFilterChanged(params: KitchenTicketQueryParams): void {
    this.currentParams = params;
    this.loadBoard(params);
    if (params.branchId) this.loadStations();
  }

  onViewDetails(ticketId: number): void {
    this.kitchenService.getTicket(ticketId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => { this.selectedTicket = data; },
      error: () => { this.error = 'Failed to load ticket details.'; },
    });
  }

  onStatusUpdate(event: { ticketId: number; status: TicketStatus }): void {
    this.kitchenService.updateTicketStatus(event.ticketId, { status: event.status })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadBoard(this.currentParams);
          this.loadStations();
          if (this.selectedTicket?.id === event.ticketId) {
            this.selectedTicket = null;
          }
        },
        error: () => { this.error = 'Failed to update ticket status.'; },
      });
  }

  onCloseModal(): void {
    this.selectedTicket = null;
  }

  startAutoRefresh(): void {
    this.autoRefreshSub = interval(this.AUTO_REFRESH_INTERVAL)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadBoard(this.currentParams);
        this.loadStations();
      });
  }

  get totalPending(): number { return this.board.pending.length; }
  get totalPreparing(): number { return this.board.preparing.length; }
  get totalDone(): number { return this.board.done.length; }
}
