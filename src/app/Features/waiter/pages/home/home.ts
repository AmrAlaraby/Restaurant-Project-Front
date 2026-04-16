import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableService } from '../../../../Core/Services/Table-Service/table-service';
import { TableInterface } from '../../../../Core/Models/TableModels/table-interface';
import { Router } from '@angular/router';
import { StatsCardsComponent } from '../../components/stats-cards/stats-cards';
import { TablesGridComponent } from '../../components/tables-grid/tables-grid';
import { ActiveOrders } from '../../components/active-orders/active-orders';
import { ReadyAlert } from '../../components/ready-alert/ready-alert';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { UsersService } from '../../../../Core/Services/User-Service/users-service';
import { UserQueryParams } from '../../../../Core/Models/UserModels/user-query-params';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    StatsCardsComponent,
    TablesGridComponent,
    ActiveOrders,
    ReadyAlert
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {

  tables: TableInterface[] = [];
  displayedTables: TableInterface[] = []; 
  orders: any[] = [];

  occupiedCount = 0;
  currentUserId = '';
  branchId!: number;
  branchName = '';
  activeOrdersCount = 0;
  waiterName = '';

  constructor(private tableService: TableService, 
              private authService: AuthService,
              private userService: UsersService,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTables();
    this.loadCurrentUser();

  }
  loadCurrentUser() {
    this.authService.getCurrentUser().subscribe(res => {
      this.currentUserId = res.id;
      this.loadWaiterData(res.email);
      this.waiterName = res.name;
    });
  }
  goToTables() {
  this.router.navigate(['/waiter/tables']);
}
  loadWaiterData(email: string) {

  const params: UserQueryParams = {
    pageIndex: 1,
    pageSize: 100
  };

  this.userService.getUsers(params).subscribe(res => {

    const waiter = res.data.find(u => u.email === email);

    console.log('Matched waiter:', waiter);

    if (!waiter) {
      console.error('Waiter not found ❌');
      return;
    }

    if (!waiter.branchId) {
      console.warn('No branch assigned ❌');
      return;
    }

    this.branchId = waiter.branchId;
    this.branchName = waiter.branchName ?? '';

    this.loadTables();
  });
}




loadTables() {

  if (!this.branchId) {
    console.warn('branchId not ready');
    return;
  }

  this.tableService.getTables({
    pageIndex: 1,
    pageSize: 100,
    branchId: this.branchId
  }).subscribe(res => {

    this.tables = res.data;

    console.log('All tables:', this.tables);

    this.displayedTables = this.tables.slice(0, 6);

    console.log('Displayed tables:', this.displayedTables);

    this.occupiedCount = this.tables.filter(t => t.isOccupied).length;
  });
}
}