import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableService } from '../../../../Core/Services/Table-Service/table-service';
import { TableInterface } from '../../../../Core/Models/TableModels/table-interface';

import { StatsCardsComponent } from '../../components/stats-cards/stats-cards';
import { TablesGridComponent } from '../../components/tables-grid/tables-grid';
import { ActiveOrders } from '../../components/active-orders/active-orders';
import { ReadyAlert } from '../../components/ready-alert/ready-alert';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    StatsCardsComponent,
    TablesGridComponent,
   
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {

  tables: TableInterface[] = [];
  orders: any[] = [];

  occupiedCount = 0;
  activeOrdersCount = 0;

  constructor(private tableService: TableService) {}

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables() {
    this.tableService.getTables({
      pageIndex: 1,
      pageSize: 100
    }).subscribe(res => {

      this.tables = res.data;

      this.occupiedCount = this.tables.filter(t => t.isOccupied).length;
    });
  }
}