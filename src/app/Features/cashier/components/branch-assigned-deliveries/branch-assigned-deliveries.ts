import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DeliveryService } from '../../../../Core/Services/Delivery-Service/delivery-service';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { Pagination } from '../../../../Shared/Components/pagination/pagination';
import { BranchDeliveryDetails } from '../branch-delivery-details/branch-delivery-details';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'app-branch-assigned-deliveries',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination, BranchDeliveryDetails, TranslatePipe],
  templateUrl: './branch-assigned-deliveries.html',
  styleUrls: ['./branch-assigned-deliveries.scss'],
})
export class BranchAssignedDeliveries implements OnInit {

  @Output() back = new EventEmitter<void>();

  deliveries: any[] = [];
  loading = false;

  pageIndex = 1;
  pageSize  = 8;
  totalCount = 0;

  filterStatus  = '';
  filterOrderId: number | null = null;

  branchName = '';
  branchArabicName = '';
  private branchId!: number;

  selectedDeliveryId: number | null = null;
  private debounceTimer: any = null;

  constructor(
    private deliveryService: DeliveryService,
    private authService: AuthService,
    private localizationService: LocalizationService,
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.branchId   = user?.branchId  ?? 0;
        this.branchName = user?.branchName ?? '';
        this.branchArabicName = user?.branchArabicName ?? '';
        this.load();
      },
      error: (err) => console.error('Failed to get current user:', err),
    });
    this.getCurrentLanguage();
  }

   CurrentLanguage: string = 'en';
    
      private destroy$ = new Subject<void>();
      getCurrentLanguage(): void {
        this.CurrentLanguage = this.localizationService.getCurrentLang();
        this.localizationService.currentLang$.pipe(takeUntil(this.destroy$)).subscribe((lang) => {
          this.CurrentLanguage = lang;
        });
      }
    
      ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
      }

  load(): void {
    this.loading = true;

    const filters = {
      branchId: this.branchId,
      status:   this.filterStatus  || null,
      orderId:  this.filterOrderId || null,
      date:     null,
    };

    this.deliveryService.getAll(this.pageIndex, this.pageSize, filters).subscribe({
      next: (res) => {
        this.deliveries = res.data;
        this.totalCount = res.count;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load deliveries:', err);
        this.loading = false;
      },
    });
  }

  onOrderIdInput(): void {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.applyFilter();
    }, 400);
  }

  applyFilter(): void {
    this.pageIndex = 1;
    this.load();
  }

  onPageChanged(page: number): void {
    this.pageIndex = page;
    this.load();
  }

  openDetails(id: number): void {
    this.selectedDeliveryId = id;
  }

  goBack(): void {
    this.back.emit();
  }
  getBranchName(): string {
    if (this.CurrentLanguage === 'ar') {
      return this.branchArabicName || this.branchName;
    }
    return this.branchName;
  }
}
