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
import { OrderDetailsInterface } from '../../../../../Core/Models/OrderModels/order-details-interface';
import { KitchenTicketStatusDto } from '../../../../../Core/Models/KitchenModels/kitchen-ticket-status-dto';
import { SignalRService } from '../../../../../Core/Services/SignalR-Service/SignalrService';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-chef-kitchen-board',
  standalone: true,
  imports: [
    CommonModule,
    ChefKitchenFilterComponent,
    TicketCardComponent,
    TicketDetailsModalComponent,
    ActiveStationsBarComponent,
    TranslatePipe
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
    private SignalRService :SignalRService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {

          // 👑 ROLE CHECK
          if (user.role !== 'Chef') {
            this.error = 'Access denied. Chief only.';
            return;
          }

          this.currentUser = user;

          // 🟡 NO BRANCH → EMPTY STATE
          if (!user.branchId) {
            this.board = { pending: [], preparing: [], done: [] };
            this.stations = [];
            return;
          }

          this.currentParams.branchId = user.branchId;

          this.loadBoard(this.currentParams);
          this.loadStations(user.branchId);
        },
        error: () => {
          this.error = 'Failed to load user data.';
        },
      });

      this.listenToOrderUpdates();
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
    // listen to updates
    // =====================
    listenToOrderUpdates() {
              let token = this.authService.getAccessToken();
        this.SignalRService.startRestaurantUpdatesConnection(token??"");
    
        
        this.SignalRService.onRestaurantUpdate("OrderCreated",(data : OrderDetailsInterface) => {  
          // Adding Tickets in the data data.kitchenTickets to the start of the pending list if the order matches the current filters
          debugger;
          if(this.currentParams.branchId && data.branchId !== this.currentParams.branchId) return;
          if(this.currentParams.orderId && data.id !== this.currentParams.orderId) return;
          data.kitchenTickets.forEach(ticket => {
            if(this.currentParams.station && ticket.station !== this.currentParams.station) return;
  
            this.board.pending.unshift({
              id: ticket.id,
              orderId: data.id,
              station: ticket.station,
              status: 0,
              startedAt: null,
              completedAt: null
            });
            });
         
          
        });
        this.SignalRService.onRestaurantUpdate("OrderUpdated",(data : OrderDetailsInterface) => {   
          debugger;
    if(this.currentParams.branchId && data.branchId !== this.currentParams.branchId) return;
  
    // remove deleted tickets
    this.board.pending = this.board.pending.filter(t =>
      t.orderId !== data.id || data.kitchenTickets.some(k => k.id === t.id)
    );
  
    this.board.preparing = this.board.preparing.filter(t =>
      t.orderId !== data.id || data.kitchenTickets.some(k => k.id === t.id)
    );
  
    this.board.done = this.board.done.filter(t =>
      t.orderId !== data.id || data.kitchenTickets.some(k => k.id === t.id)
    );
  
    // recompute after delete
    const allTickets = [...this.board.pending, ...this.board.preparing, ...this.board.done];
  
    // add new tickets
    data.kitchenTickets.forEach(ticket => {
  
      const exists = allTickets.some(t => t.id === ticket.id);
      if(exists) return;
  
      if(this.currentParams.station && ticket.station !== this.currentParams.station) return;
  
      this.board.pending.unshift({
        id: ticket.id,
        orderId: data.id,
        station: ticket.station,
        status: 0,
        startedAt: null,
        completedAt: null
      });
  
    });
  
  });
        this.SignalRService.onRestaurantUpdate("OrderCancelled",(data : OrderDetailsInterface) => {   
          // remove all tickets with order Id from the board
          debugger;
          if(this.currentParams.branchId && data.branchId !== this.currentParams.branchId) return;
          this.board.pending = this.board.pending.filter(t => t.orderId !== data.id);
          this.board.preparing = this.board.preparing.filter(t => t.orderId !== data.id);
          this.board.done = this.board.done.filter(t => t.orderId !== data.id);
        });
       this.SignalRService.onRestaurantUpdate(
    "KitchenUpdated",
    (data: KitchenTicketStatusDto) => {
      debugger;
      let ticket: any | undefined;
      let currentList: any[];
  
      // find ticket
      if ((ticket = this.board.pending.find(t => t.id === data.id))) {
        currentList = this.board.pending;
      } 
      else if ((ticket = this.board.preparing.find(t => t.id === data.id))) {
        currentList = this.board.preparing;
      } 
      else if ((ticket = this.board.done.find(t => t.id === data.id))) {
        currentList = this.board.done;
      } 
      else {
        return;
      }
  
      // update values
      ticket.status = data.status;
      ticket.startedAt = data.startedAt;
      ticket.completedAt = data.completedAt;
  
      // determine target list
      let targetList: any[];
  
      switch (data.status) {
        case TicketStatus.Pending:
          targetList = this.board.pending;
          break;
  
        case TicketStatus.Preparing:
          targetList = this.board.preparing;
          break;
  
        case TicketStatus.Done:
          targetList = this.board.done;
          break;
  
        default:
          return;
      }
  
      // move ticket if needed
      if (currentList !== targetList) {
  
        const index = currentList.indexOf(ticket);
        if (index > -1) {
          currentList.splice(index, 1);
        }
  
        targetList.unshift(ticket);
      }
  
    }
  );
  
    }
  // =====================
  // Filter
  // =====================
  onFilterChanged(params: KitchenTicketQueryParams): void {
    if (!this.currentUser?.branchId) return;

    const newParams: KitchenTicketQueryParams = {
      ...params,
      branchId: this.currentUser.branchId,
    };

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
          if (this.currentUser?.branchId) {
            this.loadBoard(this.currentParams);
            this.loadStations(this.currentUser.branchId);
          }

          if (this.selectedTicket?.id === event.ticketId) {
            this.selectedTicket = null;
          }
        },
        error: () => {
          this.error = 'Failed to update ticket status.';
        },
      });
  }

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
