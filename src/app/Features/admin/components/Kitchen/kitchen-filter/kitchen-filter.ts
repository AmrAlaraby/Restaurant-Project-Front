import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';


import { KitchenTicketQueryParams } from '../../../../../Core/Models/KitchenModels/kitchen-ticket-query-params';
import { BranchDto } from '../../../../../Core/Models/BranchModels/Branch-dto';
import { ActivePendingStationsDTO } from '../../../../../Core/Models/KitchenModels/active-pending-stations-dto';
import { TicketStatus } from '../../../../../Core/Models/KitchenModels/ticket-status';
import { KitchenService } from '../../../../../Core/Services/Kitchen-Service/kitchen-service';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../../../Core/Services/Toast-Service/toast-service';

@Component({
  selector: 'app-kitchen-filter',
  standalone: true,
  imports: [CommonModule, FormsModule,TranslatePipe],
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
  { key: 'ALL', value: null },
  { key: 'PENDING', value: TicketStatus.Pending },
  { key: 'PREPARING', value: TicketStatus.Preparing },
  { key: 'DONE', value: TicketStatus.Done },
];

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private localizationService: LocalizationService,private kitchenService: KitchenService,private toast: ToastService) {}
  CurrentLanguage: string = 'en';
  ngOnInit(): void {
    this.kitchenService.getBranches().subscribe({
      next: (data: BranchDto[]) => {
        this.branches = data;
      },
      error: (err) => {
        console.error('Failed to load branches', err);
        this.toast.error('Failed to load branches');
      }
    });
    this.getCurrentLanguage();
    // تحميل كل الـ stations عند البداية
    this.loadStations(null);
  }
private destroy$ = new Subject<void>();
  getCurrentLanguage(): void {
    this.CurrentLanguage = this.localizationService.getCurrentLang();
    this.localizationService.currentLang$
  .pipe(takeUntil(this.destroy$))
  .subscribe(lang => {
    this.CurrentLanguage = lang;
  });
  }

  ngOnDestroy(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ✅ هنا عملنا handling للـ undefined
  private loadStations(branchId: number | null | undefined): void {
    this.kitchenService.getActiveStations(branchId ?? null).subscribe({
      next: (data) => {
        this.stations = data;
        this.stationsLoaded.emit(data);
      },
      error: (err) => {
        console.error('Failed to load stations', err);
        this.toast.error('Failed to load stations');
      }
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
  getBranchName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
     return item.arabicName || item.name;
    }
    return item.name;
  }
}
