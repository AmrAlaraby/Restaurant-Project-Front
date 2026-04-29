import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    StatsCardsComponent,
    TablesGridComponent,
    ActiveOrders,
    ReadyAlertComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {

  // ── user / branch ──────────────────────────────────────
  waiterName   = '';
  branchId!:   number;
  branchName   = '';
  shiftStart   = '09:00 AM';           // عدّلي لو عندك shift API

  // ── tables ─────────────────────────────────────────────
  tables:          TableInterface[] = [];
  displayedTables: TableInterface[] = [];
  occupiedCount  = 0;
  tablesServed   = 0;                  // عدد الطاولات اللي اتخدمت اليوم

  // ── orders ─────────────────────────────────────────────
  activeOrders:     any[] = [];
  activeOrdersCount = 0;
  myOrdersTotal     = 0;

  // ── ready alert ────────────────────────────────────────
  readyOrders: any[] = [];             // الأوردرات اللي status = Ready

  constructor(
    private tableService:  TableService,
    private authService:   AuthService,
    private userService:   UsersService,
    private ordersService: OrdersService,
    private router:        Router,
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
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
      this.branchName = waiter.branchName ?? '';

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

  // ── Active Orders (for this branch) ───────────────────
  loadActiveOrders() {
    this.ordersService.getAllOrders({
      pageIndex: 1,
      pageSize: 50,
      branchId: this.branchId
      
    }).subscribe(res => {

      // const ordersToday = (res.data ?? [])
      //   .filter((o: any) => this.isToday(o.createdAt))
      //   .sort((a: any, b: any) =>
      //     new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      //   );
      //   console.log(res.data[0]);
      //   console.log(res.data);

      this.activeOrders = res.data ?? [];
      this.activeOrdersCount = this.activeOrders.length;
      console.log('Active Orders:', this.activeOrders);

      this.myOrdersTotal = this.activeOrders.reduce(
        (s: number, o: any) => s + (o.totalAmount ?? 0),
        0
      );

      this.readyOrders = this.activeOrders.filter(
        (o: any) => o.status === 'Ready'
      );
    });
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
}