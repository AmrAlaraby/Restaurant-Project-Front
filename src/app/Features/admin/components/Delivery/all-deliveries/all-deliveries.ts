import { SignalRService } from './../../../../../Core/Services/SignalR-Service/SignalrService';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Delivery } from '../../../../../Core/Models/DeliveryModels/delivery';
import { DeliveryService } from '../../../../../Core/Services/Delivery-Service/delivery-service';
import { Pagination } from "../../../../../Shared/Components/pagination/pagination";
import { Branch } from '../../../../../Core/Constants/Api_Urls';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../../Core/Services/Auth-Service/auth-service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';
import { ToastService } from '../../../../../Core/Services/Toast-Service/toast-service';

@Component({
  selector: 'app-all-deliveries',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination, TranslatePipe],
  templateUrl: './all-deliveries.html',
  styleUrls: ['./all-deliveries.scss'],
})
export class AllDeliveries {

  deliveries: Delivery[] = [];

  pageIndex = 1;
  pageSize = 5;
  totalCount = 0;

  loading = false;

  filters = {
    branchId: null,
    status: null,
    date: null,
    orderId: null
  };

  branches: any[] = [];
  statuses: string[] = [
    'ADMIN.STATUS.ASSIGNED',
    'ADMIN.STATUS.PICKED_UP',
    'ADMIN.STATUS.ON_THE_WAY',
    'ADMIN.STATUS.DELIVERED',
  ];

  statusToIndex: Record<string, number> = {
    'Assigned': 0,
    'PickedUp': 1,
    'OnTheWay': 2,
    'Delivered': 3,
  };

  stepKeys = ['ADMIN.STATUS.ASSIGNED', 'ADMIN.STATUS.PICKED_UP', 'ADMIN.STATUS.ON_THE_WAY', 'ADMIN.STATUS.DELIVERED'];

  constructor(
    private service: DeliveryService,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private SignalRService: SignalRService,
    private localizationService: LocalizationService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.load();
    this.loadBranches();
    this.listenToUpdates();
    this.getCurrentLanguage();
  }

  CurrentLanguage: string = 'en';

  private destroy$ = new Subject<void>();

  getCurrentLanguage(): void {
    this.CurrentLanguage = this.localizationService.getCurrentLang();
    this.localizationService.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        this.CurrentLanguage = lang;
      });
  }

  load() {
    this.loading = true;

    this.service.getAll(this.pageIndex, this.pageSize, this.filters)
      .subscribe({
        next: res => {
          this.deliveries = res.data;
          this.totalCount = res.count;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.toast.error('Failed to load deliveries');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  listenToUpdates(): void {
    let token = this.authService.getAccessToken();
    this.SignalRService.startRestaurantUpdatesConnection(token ?? "");
    this.SignalRService.onRestaurantUpdate("OrderAssignedToDriver", (data: Delivery) => {
      let index = this.deliveries.findIndex(d => d.id === data.id);
      if (index !== -1 && index) {
        this.deliveries[index] = data;
      }
    });
    this.SignalRService.onRestaurantUpdate("deliveryUpdated", (data: Delivery) => {
      let index = this.deliveries.findIndex(d => d.id === data.id);
      if (index !== -1 && index) {
        this.deliveries[index] = data;
      }
    });
  }

  onPageChanged(page: number) {
    this.pageIndex = page;
    this.load();
  }

  loadBranches() {
    this.http.get<any[]>(Branch.getAll)
      .subscribe({
        next: res => {
          this.branches = res;
        },
        error: () => this.toast.error('Failed to load branches')
      });
  }

  applyFilters() {
    this.pageIndex = 1;
    this.load();
  }

  openDetails(id: number) {
    this.router.navigate(['/admin/deliveries', id]);
  }

  getBranchName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.arabicName || item.name;
    }
    return item.name;
  }

  getStepClass(deliveryStatus: string, i: number): string {
    const current = this.statusToIndex[deliveryStatus] ?? 0;
    if (i < current) return 'done';
    if (i === current) return 'active';
    return 'inactive';
  }

  getStepIcon(deliveryStatus: string, i: number): string {
    const current = this.statusToIndex[deliveryStatus] ?? 0;
    if (i < current) return '✓';
    if (i === current) return '●';
    return '○';
  }
}
