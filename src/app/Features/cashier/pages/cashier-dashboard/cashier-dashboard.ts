import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaymentService } from '../../../../Core/Services/Payment-Service/payment-service';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';

import { DashboardStatsComponent } from '../../components/dashboard-stats/dashboard-stats';
import { AwaitingOrdersListComponent } from '../../components/awaiting-orders-list/awaiting-orders-list';
import { PaymentMethodsSummaryComponent } from '../../components/payment-methods-summary/payment-methods-summary';
import { RecentTransactionsComponent } from '../../components/recent-transactions/recent-transactions';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../Core/Services/Localization-Service/localization-service';

export interface DashboardStat {
  value: string;
  label: string;
  // arabicLabel?: string; 
  accent: 'green' | 'red' | 'green2' | 'red2';
}

export interface PaymentMethodSummary {
  method: string;
  icon: string;
  amount: number;
  count: number;
  color: string;
}

export interface RecentTransaction {
  orderId: number;
  method: string;
  amount: number;
  status: string;
}

@Component({
  selector: 'app-cashier-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    DashboardStatsComponent,
    AwaitingOrdersListComponent,
    PaymentMethodsSummaryComponent,
    RecentTransactionsComponent,
    TranslatePipe
  ],
  templateUrl: './cashier-dashboard.html',
  styleUrl: './cashier-dashboard.scss',
})
export class CashierDashboard implements OnInit {
  currentUserId = '';
  cashierName = '';
  branchName = '';
  branchArabicName?:string = '';

  stats: DashboardStat[] = [];
  paymentSummary: PaymentMethodSummary[] = [];
  recentTransactions: RecentTransaction[] = [];

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private authService: AuthService,
    private localizationService: LocalizationService,
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadPaymentSummary();
    this.loadRecentTransactions();
    this.loadCurrentUser();
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
    loadCurrentUser() {
    this.authService.getCurrentUser().subscribe(res => {
      this.currentUserId = res.id;
      this.cashierName = res.name;
      this.branchName = res.branchName || 'Branch 1';
      this.branchArabicName = res.branchArabicName ;
      
    });
  }


  loadStats() {
    this.paymentService.getAllWithoutPagination().subscribe(payments => {
    const todayPayments = payments.filter(p => this.isTodayRelevant(p));
    const todayPending = payments.filter(p => p.paymentStatus === 'Pending' ).length;
    console.log('Today\'s Payments:', todayPayments);
    console.log('Today\'s Pending Payments:', todayPending);

      const collected = todayPayments
        .filter(p => p.paymentStatus === 'Paid')
        .reduce((sum, p) => sum + (p.paidAmount ?? 0), 0);

      const pending = todayPending;
      const processed = todayPayments.filter(p => p.paymentStatus === 'Paid').length;
      const refunded = todayPayments.filter(p => p.paymentStatus === 'Refunded').length;

      this.stats = [
  {
    value: `EGP ${collected.toLocaleString()}`,
    label: 'CASHIER.DASHBOARD.HOME.STATS.COLLECTED_TODAY',
    accent: 'green'
  },
  {
    value: `${pending}`,
    label: 'CASHIER.DASHBOARD.HOME.STATS.PENDING_PAYMENTS',
    accent: 'red'
  },
  {
    value: `${processed}`,
    label: 'CASHIER.DASHBOARD.HOME.STATS.PAYMENTS_PROCESSED',
    accent: 'green2'
  },
  {
    value: `${refunded}`,
    label: 'CASHIER.DASHBOARD.HOME.STATS.REFUNDS_ISSUED',
    accent: 'red2'
  }
];
    });
  }
   goToOrders() {
      this.router.navigate(['/cashier/orders']);
    }

  private isToday(date: string | null): boolean {
    if (!date) return false;
    const d = new Date(date);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }
  

  loadPaymentSummary() {
    this.paymentService.getAll({ pageIndex: 1, pageSize: 200, status: 'Paid' }).subscribe(res => {
      const payments = res.data ?? [];
      const methods = ['Cash', 'Card', 'InstaPay', 'Wallet'];
      const icons   = ['💵', '💳', '📱', '👛'];
      const colors  = ['#16a34a', '#1d4ed8', '#7c3aed', '#db2777'];

      this.paymentSummary = methods.map((m, i) => {
        const group = payments.filter(p => p.paymentMethod === m);
        return {
          method: m,
          icon: icons[i],
          amount: group.reduce((s, p) => s + (p.paidAmount ?? 0), 0),
          count: group.length,
          color: colors[i],
        };
      }).filter(s => s.count > 0);
    });
  }

  loadRecentTransactions() {
    this.paymentService.getAll({ pageIndex: 1, pageSize: 10 }).subscribe(res => {
      this.recentTransactions = (res.data ?? []).map(p => ({
        orderId: p.orderId,
        method: p.paymentMethod,
        amount: p.paidAmount ?? 0,
        status: p.paymentStatus,
      }));
    });
  }

  goToPayment(orderId: number) {
      this.router.navigate(['/cashier/payments'], { queryParams: { orderId } });
    }

    private isTodayRelevant(p: any): boolean {
    if (p.paymentStatus === 'Paid' || p.paymentStatus === 'Refunded') {
      return this.isToday(p.paidAt);
    }
    if (p.paymentStatus === 'Pending') {
      return this.isToday(p.createdAt);
    }
    return false;
  }

  getBranchName(): string {
    
    if (this.CurrentLanguage === 'ar') {
      return this.branchArabicName || this.branchName ;
    }
    return this.branchName ;
  }
}