
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TableService } from '../../../../Core/Services/Table-Service/table-service';
import { TableInterface } from '../../../../Core/Models/TableModels/table-interface';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { UsersService } from '../../../../Core/Services/User-Service/users-service';
import { UserQueryParams } from '../../../../Core/Models/UserModels/user-query-params';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';

import { StatsCardsComponent } from '../../components/stats-cards/stats-cards';
import { TablesGridComponent } from '../../components/tables-grid/tables-grid';
import { ActiveOrders} from '../../components/active-orders/active-orders';
import { ReadyAlertComponent } from '../../components/ready-alert/ready-alert';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../Core/Services/Localization-Service/localization-service';
import { Pagination } from "../../../../Shared/Components/pagination/pagination";
import { TableOrdersService } from '../../../../Core/Services/Table-Order-Service/table-orders.service';
import { OrderDetails } from "../../../admin/components/Order/order-details/order-details";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    StatsCardsComponent,
    TablesGridComponent,
    ActiveOrders,
    ReadyAlertComponent,
    TranslatePipe,
    Pagination,
    OrderDetails
],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {

  // ── user / branch ──────────────────────────────────────
  waiterName   = '';
  branchId!:   number;
  branchNames   = {branchName: '', branchArabicName: ''};
  shiftStart   = '09:00 AM';           // عدّلي لو عندك shift API

  // ── tables ─────────────────────────────────────────────
  tables:          TableInterface[] = [];
  displayedTables: TableInterface[] = [];
  occupiedCount  = 0;
  tablesServed   = 0;                 

  // ── orders ─────────────────────────────────────────────
  activeOrders:     any[] = [];
  activeOrdersCount = 0;
  myOrdersTotal     = 0;

  // ── ready alert ────────────────────────────────────────
  readyOrders: any[] = [];             


  constructor(
    private tableService:  TableService,
    private authService:   AuthService,
    private userService:   UsersService,
    private ordersService: OrdersService,
    private router:        Router,
    private localizationService: LocalizationService,
      
  ) {}
  ngOnInit(): void {
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
    
      ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
      }

  // ── Step 1: get current user ───────────────────────────
  loadCurrentUser() {
    this.authService.getCurrentUser().subscribe(res => {
      this.waiterName = res.name ?? res.email;
      this.loadWaiterBranch(res.email);
    });
  }

  // ── Step 2: get branchId from users list ──────────────
  loadWaiterBranch(email: string) {
    const params: UserQueryParams = { pageIndex: 1, pageSize: 100 };

    this.userService.getUsers(params).subscribe(res => {
      const waiter = res.data.find((u: any) => u.email === email);
      if (!waiter?.branchId) return;

      this.branchId   = waiter.branchId;
      this.branchNames.branchName = waiter.branchName ?? '';
      this.branchNames.branchArabicName = waiter.branchArabicName ?? '';

      // ── Step 3: load everything in parallel ───────────
      this.loadTables();
      this.loadActiveOrders();
    });
  }

  // ── Tables ─────────────────────────────────────────────
  loadTables() {
    this.tableService.getTables({
      pageIndex: 1,
      pageSize:  100,
      branchId:  this.branchId,

    }).subscribe(res => {
      this.tables          = res.data;
      this.displayedTables = res.data.slice(0, 6);
      this.occupiedCount   = res.data.filter((t: TableInterface) => t.isOccupied).length;
      this.tablesServed    = res.data.filter((t: TableInterface) => t.isOccupied).length;
    });
  }

  pageIndex = 1;
  pageSize = 10;
  totalCount = 0;

  // ── Active Orders (for this branch) ───────────────────
  loadActiveOrders() {
    this.ordersService.getAllOrders({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      branchId: this.branchId
    }).subscribe(res => {

      const allOrders = res.data ?? [];
      
      this.activeOrders = allOrders.filter(
        (o: any) =>
          o.status === 'Received' ||
          o.status === 'Preparing' ||
          o.status === 'Ready'
      );

      this.totalCount = res.count;
      this.activeOrdersCount = this.activeOrders.length;

      this.myOrdersTotal = this.activeOrders.reduce(
        (s: number, o: any) => s + (o.totalAmount ?? 0),
        0
      );

      this.readyOrders = this.activeOrders.filter(
        (o: any) => o.status === 'Ready'
      );
    });
  }


  onPageChanged(page: number) {
    this.pageIndex = page;
    this.loadActiveOrders();
  }

  private isToday(date: string | null): boolean {
    if (!date) return false;

    const d = new Date(date);
    const now = new Date();

    return d.toDateString() === now.toDateString();
  }
  // ── Navigation ─────────────────────────────────────────
  goToTables()  { this.router.navigate(['/waiter/tables']); }
  goToKitchen() { this.router.navigate(['/waiter/kitchen']); }
  goToNewOrder(){ this.router.navigate(['/waiter/place-order']); }

  getbranchName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.branchArabicName || item.branchName;
    }
    return item.branchName;
  }



  onOpenOrder(tableId: number) {
    const table = this.displayedTables.find(t => t.id === tableId);

    if (!table) return;

    if (table.isOccupied) {
      this.router.navigate(['/waiter/tables'], {
        queryParams: { highlight: tableId }
      });
    } else {
      this.router.navigate(['/waiter/place-order', tableId]);
    }
  }


}