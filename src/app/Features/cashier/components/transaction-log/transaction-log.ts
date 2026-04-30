import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { UserInterface } from '../../../../Core/Models/AuthModels/user-interface';
import { PaymentDto } from '../../../../Core/Models/PaymentModels/payment-dto';
import { PaymentQueryParams } from '../../../../Core/Models/PaymentModels/payment-query-params';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { PaymentService } from '../../../../Core/Services/Payment-Service/payment-service';
import { Pagination } from '../../../../Shared/Components/pagination/pagination';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LocalizationService } from '../../../../Core/Services/Localization-Service/localization-service';

export type FilterType = 'All' | 'Cash' | 'Card' | 'InstaPay' | 'Wallet';

@Component({
  selector: 'app-transaction-log',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Pagination,
    DecimalPipe,
    DatePipe,
    TranslatePipe
  ],
  templateUrl: './transaction-log.html',
  styleUrls: ['./transaction-log.scss'],
})
export class TransactionLogComponent implements OnInit {

  private authService    = inject(AuthService);
  private paymentService = inject(PaymentService);
  private translate      = inject(TranslateService);

  private orderIdDebounce$ = new Subject<number | null>();

  // ── state ──
  currentUser   = signal<UserInterface | null>(null);
  payments      = signal<PaymentDto[]>([]);
  loading       = signal(true);
  error         = signal<string | null>(null);
  totalCount    = signal(0);
  pageIndex     = signal(1);
  activeFilter  = signal<FilterType>('All');
  statusFilter  = signal<string>('');
  orderIdFilter = signal<number | null>(null);

  readonly pageSize = 5;
  readonly filterOptions: FilterType[] = ['All', 'Cash', 'Card', 'InstaPay', 'Wallet'];

  constructor(
        private localizationService: LocalizationService,
      ) {}

  ngOnInit(): void {

    // debounce search
    this.orderIdDebounce$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((val) => {
        this.orderIdFilter.set(val);
        this.pageIndex.set(1);
        this.loadPayments();
      });

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.loadPayments();
      },
      error: () => {
        this.error.set(this.translate.instant('CASHIER.TRANSACTIONS.ERROR_USER'));
        this.loading.set(false);
      },
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
  loadPayments(): void {
    const user = this.currentUser();
    if (!user) return;

    this.loading.set(true);
    this.error.set(null);

    const filter = this.activeFilter();

    const params: PaymentQueryParams = {
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize,
      branchId: user.branchId,
    };

    if (filter !== 'All') params.method = filter;
    if (this.statusFilter()) params.status = this.statusFilter();
    if (this.orderIdFilter() != null) params.orderId = this.orderIdFilter()!;

    this.paymentService.getAll(params)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.payments.set(res.data);
          this.totalCount.set(res.count);
        },
        error: () => {
          this.error.set(this.translate.instant('CASHIER.TRANSACTIONS.ERROR_LOAD'));
        },
      });
  }

  onFilterChange(f: FilterType): void {
    this.activeFilter.set(f);
    this.pageIndex.set(1);
    this.loadPayments();
  }

  onStatusChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.statusFilter.set(val);
    this.pageIndex.set(1);
    this.loadPayments();
  }

  onOrderIdChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.orderIdDebounce$.next(val ? +val : null);
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
    this.loadPayments();
  }

  exportCSV(): void {
    const headers = [
      this.translate.instant('CASHIER.TRANSACTIONS.CSV.ORDER'),
      this.translate.instant('CASHIER.TRANSACTIONS.CSV.METHOD'),
      this.translate.instant('CASHIER.TRANSACTIONS.CSV.AMOUNT'),
      this.translate.instant('CASHIER.TRANSACTIONS.CSV.STATUS'),
      this.translate.instant('CASHIER.TRANSACTIONS.CSV.DATE')
    ];

    const rows = this.payments().map((tx) => [
      `#${tx.orderId}`,
      tx.paymentMethod,
      tx.paidAmount,
      tx.paymentStatus,
      tx.paidAt ?? '—',
    ]);

    const csv  = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);

    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: 'transactions.csv'
    });

    a.click();
    URL.revokeObjectURL(url);
  }

  // ── helpers ──
  tabIcon(f: FilterType): string {
    const map: Record<FilterType, string> = {
      All: '',
      Cash: '💵',
      Card: '💳',
      InstaPay: '🔷',
      Wallet: '👛',
    };
    return map[f];
  }

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

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  getBranchName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.branchArabicName || item.branchName || this.translate.instant('CASHIER.TRANSACTIONS.BRANCH');
    }
    return item.branchName || this.translate.instant('CASHIER.TRANSACTIONS.BRANCH');
  }
}