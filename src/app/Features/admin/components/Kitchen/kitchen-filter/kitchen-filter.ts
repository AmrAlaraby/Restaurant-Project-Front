import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KitchenTicketQueryParams } from '../../../../../Core/Models/KitchenModels/kitchen-ticket-query-params';
import { BranchDto } from '../../../../../Core/Models/BranchModels/Branch-dto';
import { ActivePendingStationsDTO } from '../../../../../Core/Models/KitchenModels/active-pending-stations-dto';
import { TicketStatus } from '../../../../../Core/Models/KitchenModels/ticket-status';
import { KitchenService } from '../../../../../Core/Services/Kitchen-Service/kitchen-service';

@Component({
  selector: 'app-kitchen-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kitchen-filter.html',
  styleUrls: ['./kitchen-filter.scss'],
})
export class KitchenFilterComponent implements OnInit, OnDestroy {

  @Output() filterChanged = new EventEmitter<KitchenTicketQueryParams>();
  @Output() stationsLoaded = new EventEmitter<ActivePendingStationsDTO[]>();

  branches: BranchDto[] = [];
  stations: ActivePendingStationsDTO[] = [];

  params: KitchenTicketQueryParams = {
    branchId: null,
    orderId: null,
    station: null,
    status: null,
  };

  statusOptions = [
    { label: 'All', value: null },
    { label: 'Pending', value: TicketStatus.Pending },
    { label: 'Preparing', value: TicketStatus.Preparing },
    { label: 'Done', value: TicketStatus.Done },
  ];

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private kitchenService: KitchenService) {}

  ngOnInit(): void {
    this.kitchenService.getBranches().subscribe({
      next: (data: BranchDto[]) => {
        this.branches = data;
      },
      error: (err) => console.error('Failed to load branches', err),
    });

    // تحميل كل الـ stations عند البداية
    this.loadStations(null);
  }

  ngOnDestroy(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }

  // ✅ هنا عملنا handling للـ undefined
  private loadStations(branchId: number | null | undefined): void {
    this.kitchenService.getActiveStations(branchId ?? null).subscribe({
      next: (data) => {
        this.stations = data;
        this.stationsLoaded.emit(data);
      },
      error: (err) => console.error('Failed to load stations', err),
    });
  }

  onBranchChange(): void {
    this.params.station = null;
    this.stations = [];
    this.stationsLoaded.emit([]);

    // ✅ نضمن إننا ما نبعتش undefined
    this.loadStations(this.params.branchId ?? null);

    this.filterChanged.emit({
      ...this.params,
      branchId: this.params.branchId ?? null
    });
  }

  onFilterChange(): void {
    this.filterChanged.emit({
      ...this.params,
      branchId: this.params.branchId ?? null,
      orderId: this.params.orderId ?? null,
      station: this.params.station ?? null,
      status: this.params.status ?? null,
    });
  }

  onOrderIdChange(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {
      this.filterChanged.emit({
        ...this.params,
        branchId: this.params.branchId ?? null,
        orderId: this.params.orderId ?? null,
      });
    }, 500);
  }

  onReset(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.params = {
      branchId: null,
      orderId: null,
      station: null,
      status: null,
    };

    this.stations = [];
    this.stationsLoaded.emit([]);

    this.filterChanged.emit({ ...this.params });

    this.loadStations(null);
  }
}
