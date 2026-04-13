import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardDTO } from '../../../../../Core/Models/ReportModels/dashboard-model';
import { RevenueDTO } from '../../../../../Core/Models/ReportModels/revenue-model';
import { OrdersByTypeDTO } from '../../../../../Core/Models/ReportModels/orders-by-type-model';
import { TopItemsDTO } from '../../../../../Core/Models/ReportModels/top-items-model';
import { InventoryUsageDTO } from '../../../../../Core/Models/ReportModels/inventory-usage-model';
import { ReportService } from '../../../../../Core/Services/Report-Service/report-service';


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
    console.log('Loading dashboard data...');

    this.reportService.getDashboard().subscribe({
      next: res => {
        console.log('Dashboard data received:', res);
        this.dashboard = res;
      },
      error: (err: any) => {
        console.error('Dashboard error:', err.status, err.statusText);
        console.error('Error message:', err.message);
        console.error('Response body:', err.error);
      }
    });

    this.reportService.getRevenue().subscribe({
      next: res => {
        console.log('Revenue data received:', res);
        this.revenue = res;
      },
      error: (err: any) => {
        console.error('Revenue error:', err.status, err.statusText);
        console.error('Error message:', err.message);
        console.error('Response body:', err.error);
      }
    });

    this.reportService.getOrdersByType().subscribe({
      next: res => {
        console.log('Orders data received:', res);
        this.orders = res;
      },
      error: (err: any) => {
        console.error('Orders error:', err.status, err.statusText);
        console.error('Error message:', err.message);
        console.error('Response body:', err.error);
      }
    });

    this.reportService.getTopItems().subscribe({
      next: res => {
        console.log('Top items data received:', res);
        this.topItems = res;
      },
      error: (err: any) => {
        console.error('Top items error:', err.status, err.statusText);
        console.error('Error message:', err.message);
        console.error('Response body:', err.error);
      }
    });

    this.reportService.getInventoryUsage().subscribe({
      next: res => {
        console.log('Inventory data received:', res);
        this.inventory = res;
      },
      error: (err: any) => {
        console.error('Inventory error:', err.status, err.statusText);
        console.error('Error message:', err.message);
        console.error('Response body:', err.error);
      }
    });
  }
}
