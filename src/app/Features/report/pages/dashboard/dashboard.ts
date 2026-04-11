import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../../Core/Services/Report-Service/report-service';
import { DashboardDTO } from '../../../../Core/Models/ReportModels/dashboard-model';
import { RevenueDTO } from '../../../../Core/Models/ReportModels/revenue-model';
import { OrdersByTypeDTO } from '../../../../Core/Models/ReportModels/orders-by-type-model';
import { TopItemsDTO } from '../../../../Core/Models/ReportModels/top-items-model';
import { InventoryUsageDTO } from '../../../../Core/Models/ReportModels/inventory-usage-model';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

  dashboard?: DashboardDTO;
  revenue: RevenueDTO[] = [];
  orders?: OrdersByTypeDTO;
  topItems: TopItemsDTO[] = [];
  inventory: InventoryUsageDTO[] = [];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.reportService.getDashboard().subscribe(res => this.dashboard = res);

    this.reportService.getRevenue().subscribe(res => this.revenue = res);

    this.reportService.getOrdersByType().subscribe(res => this.orders = res);

    this.reportService.getTopItems().subscribe(res => this.topItems = res);

    this.reportService.getInventoryUsage().subscribe(res => this.inventory = res);
  }
}