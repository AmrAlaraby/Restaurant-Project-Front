import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KitchenTicketQueryParams } from '../../../../../Core/Models/KitchenModels/kitchen-ticket-query-params';
import { ActivePendingStationsDTO } from '../../../../../Core/Models/KitchenModels/active-pending-stations-dto';
import { TicketStatus } from '../../../../../Core/Models/KitchenModels/ticket-status';
import { KitchenService } from '../../../../../Core/Services/Kitchen-Service/kitchen-service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-chef-kitchen-filter',
  standalone: true,
  imports: [CommonModule, FormsModule,TranslatePipe],
  templateUrl: './chef-kitchen-filter.html',
  styleUrls: ['./chef-kitchen-filter.scss'],
})
export class ChefKitchenFilterComponent implements OnChanges, OnDestroy {

  @Input() branchId!: number;
  @Output() filterChanged = new EventEmitter<KitchenTicketQueryParams>();

  stations: ActivePendingStationsDTO[] = [];

  params: KitchenTicketQueryParams = {
    branchId: null,
    orderId: null,
    station: null,
    status: null,
  };

statusOptions = [
  { label: 'CHEF.KITCHEN.STATUS.ALL', value: null },
  { label: 'CHEF.KITCHEN.STATUS.PENDING', value: TicketStatus.Pending },
  { label: 'CHEF.KITCHEN.STATUS.PREPARING', value: TicketStatus.Preparing },
  { label: 'CHEF.KITCHEN.STATUS.DONE', value: TicketStatus.Done },
];

  // debounce timer عشان الـ orderId input متبعتش request على كل ضغطة
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private kitchenService: KitchenService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['branchId'] && this.branchId != null) {
      this.params.branchId = this.branchId;
      this.loadStations();
    }
  }

  ngOnDestroy(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }

  private loadStations(): void {
    this.kitchenService.getActiveStations(this.branchId).subscribe({
      next: (data) => {
        this.stations = data;
      },
      error: (err) => console.error('Failed to load stations', err),
    });
  }

  // للـ select fields — يفلتر فوراً
  onFilterChange(): void {
    this.filterChanged.emit({ ...this.params });
  }

  // للـ orderId input — ينتظر 500ms بعد آخر ضغطة
  onOrderIdChange(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.filterChanged.emit({ ...this.params });
    }, 500);
  }

  onReset(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.params = {
      branchId: this.branchId,
      orderId: null,
      station: null,
      status: null,
    };
    this.filterChanged.emit({ ...this.params });
  }
}
