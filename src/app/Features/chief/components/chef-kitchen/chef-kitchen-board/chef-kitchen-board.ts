import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { KitchenBoardDto } from '../../../../../Core/Models/KitchenModels/kitchen-board-dto';
import { ActivePendingStationsDTO } from '../../../../../Core/Models/KitchenModels/active-pending-stations-dto';
import { KitchenTicketDetailsDto } from '../../../../../Core/Models/KitchenModels/kitchen-ticket-details-dto';
import { KitchenTicketQueryParams } from '../../../../../Core/Models/KitchenModels/kitchen-ticket-query-params';
import { KitchenService } from '../../../../../Core/Services/Kitchen-Service/kitchen-service';
import { AuthService } from '../../../../../Core/Services/Auth-Service/auth-service';
import { UserInterface } from '../../../../../Core/Models/AuthModels/user-interface';
import { TicketStatus } from '../../../../../Core/Models/KitchenModels/ticket-status';
import { ActiveStationsBarComponent } from '../../../../admin/components/Kitchen/active-stations-bar/active-stations-bar';
import { TicketCardComponent } from '../../../../admin/components/Kitchen/ticket-card/ticket-card';
import { TicketDetailsModalComponent } from '../../../../admin/components/Kitchen/ticket-details/ticket-details';
import { ChefKitchenFilterComponent } from '../chef-kitchen-filter/chef-kitchen-filter';

@Component({
  selector: 'app-chef-kitchen-board',
  standalone: true,
  imports: [
    CommonModule,
    ChefKitchenFilterComponent,
    TicketCardComponent,
    TicketDetailsModalComponent,
    ActiveStationsBarComponent,
  ],
  templateUrl: './chef-kitchen-board.html',
  styleUrls: ['./chef-kitchen-board.scss'],
})
export class ChefKitchenBoardComponent implements OnInit, OnDestroy {

  board: KitchenBoardDto = { pending: [], preparing: [], done: [] };
  stations: ActivePendingStationsDTO[] = [];
  selectedTicket: KitchenTicketDetailsDto | null = null;
  currentUser: UserInterface | null = null;

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

  constructor(
    private kitchenService: KitchenService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.currentUser = user;
          this.currentParams.branchId = user.branchId;
          this.loadBoard(this.currentParams);
          this.loadStations(user.branchId); // ✅ Fix: load stations for ActiveStationsBarComponent
        },
        error: () => {
          this.error = 'Failed to load user data.';
        },
      });
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

    this.kitchenService.getBoard(params)
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
  // Load Stations
  // =====================
  loadStations(branchId: number): void {
    this.stationsLoading = true;

    this.kitchenService.getActiveStations(branchId)
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
    const newParams: KitchenTicketQueryParams = {
      ...params,
      branchId: this.currentUser!.branchId,
    };

    if (JSON.stringify(newParams) === JSON.stringify(this.currentParams)) return;

    this.currentParams = newParams;
    this.loadBoard(this.currentParams);
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
          this.loadStations(this.currentUser!.branchId);

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
