import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableService } from '../../../../Core/Services/Table-Service/table-service';
import { TableInterface } from '../../../../Core/Models/TableModels/table-interface';
import { Pagination } from '../../../../Shared/Components/pagination/pagination';
import { TableOrdersService } from '../../../../Core/Services/Table-Order-Service/table-orders.service';
import { WaiterTableList } from "../../components/tabble-waiter/waiter-table-list/waiter-table-list";

import { OrderDetails } from '../../../admin/components/Order/order-details/order-details';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { UsersService } from '../../../../Core/Services/User-Service/users-service';
import { TableSearch } from '../../components/tabble-waiter/table-search/table-search';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizationService } from '../../../../Core/Services/Localization-Service/localization-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-table-waiter',
  standalone: true,
  imports: [
    CommonModule,
    Pagination,
    WaiterTableList,
    TableSearch,
    OrderDetails,
    TranslatePipe
  ],
  templateUrl: './table-waiter.html',
  styleUrl: './table-waiter.scss',
})
export class TableWaiter implements OnInit {

  private tableService = inject(TableService);
  private tableOrdersService = inject(TableOrdersService);
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  //=------------branchname----------------
  branchNames   = {branchName: '', branchArabicName: ''};




  // ---------------- Tables ----------------
  tables: TableInterface[] = [];
  pageIndex = 1;
  pageSize = 5;
  totalCount = 0;

  // ---------------- Order Modal ----------------
  selectedOrderId: number | null = null;
  showOrderModal = false;

  // ---------------- Filters ----------------
  branchId?: number;
  isOccupied?: boolean;
  search?: string;

  constructor(
        private localizationService: LocalizationService,
      ) {}

 ngOnInit(): void {
  this.authService.getCurrentUser().subscribe({
    next: (user) => {
      this.branchId = user.branchId;

     
      this.usersService.getBranches().subscribe({
        next: (branches) => {
          const branch = branches.find(b => b.id === this.branchId);
          this.branchNames.branchName = branch?.name ?? '';
      this.branchNames.branchArabicName = branch?.arabicName ?? '';
        }
      });

      this.loadTables();
    },
    error: (err) => console.error(err)
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
  loadTables() {
    this.tableService.getTables({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      branchId: this.branchId,
      isOccupied: this.isOccupied,
      search: this.search,
    }).subscribe({
      next: (res) => {
        this.tables = res.data;
        this.totalCount = res.count;
      },
      error: (err) => console.error(err)
    });
  }

  onPageChanged(page: number) {
    this.pageIndex = page;
    this.loadTables();
  }

  onToggle(id: number) {
    this.tableService.toggleStatus(id).subscribe({
      next: () => this.loadTables(),
      error: (err) => console.error(err)
    });
  }

  onOpenOrder(tableId: number) {
    this.showOrderModal = false;

    setTimeout(() => {
      this.tableOrdersService.getActiveOrder(tableId).subscribe({
        next: (orders) => {
          if (!orders || orders.length === 0) {
            this.selectedOrderId = null;
            this.showOrderModal = true;
            return;
          }

          this.selectedOrderId = orders[0].orderId;
          this.showOrderModal = true;
        },
        error: (err) => console.error(err),
      });
    }, 0);
  }

  closeOrderModal() {
    this.showOrderModal = false;
    this.selectedOrderId = null;
  }

  
  onFilterChanged(filters: { isOccupied?: boolean; search?: string }) {
    this.isOccupied = filters.isOccupied;
    this.search = filters.search?.trim().toLowerCase();

    this.pageIndex = 1;
    this.loadTables();
  }
  getbranchName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.branchArabicName || item.branchName;
    }
    return item.branchName;
  }
}