import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DecimalPipe, UpperCasePipe } from '@angular/common';
import { finalize, Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Branch } from '../../../../../Core/Models/BranchModels/branch-interface';
import { PaymentDto } from '../../../../../Core/Models/PaymentModels/payment-dto';
import { PaymentQueryParams } from '../../../../../Core/Models/PaymentModels/payment-query-params';
import { BranchService } from '../../../../../Core/Services/Branch-Service/branch-service';
import { PaymentService } from '../../../../../Core/Services/Payment-Service/payment-service';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';



@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  imports: [CommonModule, DecimalPipe, UpperCasePipe, TranslatePipe],
  templateUrl: './recent-transactions.html',
  styleUrls: ['./recent-transactions.scss'],
})
export class RecentTransactionsComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private branchService  = inject(BranchService);
  private localizationService = inject(LocalizationService)

  private orderIdDebounce$ = new Subject<number | null>();

  payments      = signal<PaymentDto[]>([]);
  branches      = signal<Branch[]>([]);
  totalCount    = signal(0);
  loading       = signal(true);
  error         = signal<string | null>(null);
  orderIdFilter = signal<number | null>(null);

  private selectedBranchId: number | null = null;
  private selectedMethod:   string = '';
  private selectedStatus:   string = '';

  private readonly RECENT_COUNT = 5;

  ngOnInit(): void {
    this.orderIdDebounce$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((val) => {
        this.orderIdFilter.set(val);
        this.load();
      });

    this.loadBranches();
    this.load();
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

  loadBranches(): void {
    this.branchService.getBranches().subscribe({
      next: (branches) => this.branches.set(branches),
      error: () => {}
    });
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    const params: PaymentQueryParams = {
      pageIndex: 1,
      pageSize:  this.RECENT_COUNT,
    };

    if (this.selectedBranchId != null) params.branchId = this.selectedBranchId;
    if (this.selectedMethod)           params.method   = this.selectedMethod;
    if (this.selectedStatus)           params.status   = this.selectedStatus;
    if (this.orderIdFilter() != null)  params.orderId  = this.orderIdFilter()!;

    this.paymentService.getAll(params)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next:  (res) => { this.payments.set(res.data); this.totalCount.set(res.count); },
        error: () => this.error.set('Failed to load transactions.'),
      });
  }

  onBranchChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedBranchId = val ? +val : null;
    this.load();
  }

  onMethodChange(event: Event): void {
    this.selectedMethod = (event.target as HTMLSelectElement).value;
    this.load();
  }

  onStatusChange(event: Event): void {
    this.selectedStatus = (event.target as HTMLSelectElement).value;
    this.load();
  }

  onOrderIdChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.orderIdDebounce$.next(val ? +val : null);
  }

  // ── helpers ──
  methodDotClass(method: string): string {
    switch (method?.toLowerCase()) {
      case 'cash':     return 'dot-cash';
      case 'card':     return 'dot-card';
      case 'instapay': return 'dot-instapay';
      case 'wallet':   return 'dot-wallet';
      default:         return 'dot-default';
    }
  }

  statusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'paid':     return 'status-badge status-paid';
      case 'refunded': return 'status-badge status-refunded';
      case 'pending':  return 'status-badge status-pending';
      case 'failed':   return 'status-badge status-failed';
      default:         return 'status-badge status-default';
    }
  }

  isRefunded(status: string): boolean {
    return status?.toLowerCase() === 'refunded';
  }

  getBranchName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.arabicName || item.name;
    }
    return item.name;
  }
}
