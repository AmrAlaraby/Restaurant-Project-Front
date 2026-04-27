import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardDTO } from '../../../../../Core/Models/ReportModels/dashboard-model';
import { RevenueDTO } from '../../../../../Core/Models/ReportModels/revenue-model';
import { OrdersByTypeDTO } from '../../../../../Core/Models/ReportModels/orders-by-type-model';
import { TopItemsDTO } from '../../../../../Core/Models/ReportModels/top-items-model';
import { InventoryUsageDTO } from '../../../../../Core/Models/ReportModels/inventory-usage-model';
import { ReportService } from '../../../../../Core/Services/Report-Service/report-service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';


@Component({
  standalone: true,
  imports: [CommonModule,TranslatePipe],
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
  CurrentLanguage: string = 'en';

  constructor(private reportService: ReportService,private localizationService:LocalizationService) {}

  ngOnInit(): void {
    this.loadData();
    this.getCurrentLanguage();
  }

  getCurrentLanguage(): void {
    this.CurrentLanguage = this.localizationService.getCurrentLang();
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
  getIngredientName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
     return item.ingredientArabicName || item.ingredientName;
    }
    return item.ingredientName;
  }
    getmenuItemName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
     return item.arabicName || item.name;
    }
    return item.name;
  }
}
