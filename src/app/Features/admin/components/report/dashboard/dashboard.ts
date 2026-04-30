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
import { DailyRevenueDTO } from '../../../../../Core/Models/ReportModels/DailyRevenueDTO';


@Component({
  standalone: true,
  imports: [CommonModule,TranslatePipe],
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  
  dailyRevenue: DailyRevenueDTO[] = [];
  dashboard?: DashboardDTO;
  revenue: RevenueDTO[] = [];
  orders?: OrdersByTypeDTO;
  topItems: TopItemsDTO[] = [];
  inventory: InventoryUsageDTO[] = [];
  CurrentLanguage: string = 'en';
circumference = 2 * Math.PI * 48;

  totalOrders = 0;
  dineInPercent = 0;
  pickupPercent = 0;
  deliveryPercent = 0;

  dineInCircumference = 0;
  pickupCircumference = 0;
  deliveryCircumference = 0;

  dineInOffset = 0;
  pickupOffset = 0;
  deliveryOffset = 0;

  constructor(private reportService: ReportService,
    private localizationService:LocalizationService) {}

  ngOnInit(): void {
    this.loadData();
    this.getCurrentLanguage();

  }

  getCurrentLanguage(): void {
    this.CurrentLanguage = this.localizationService.getCurrentLang();
    this.localizationService.currentLang$
    .subscribe(lang => {
      this.CurrentLanguage = lang;
    });
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
        this.calculateDonutData();
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

    this.reportService.getDailyRevenue().subscribe({
      next: res => {
        this.dailyRevenue = res;
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

  getDayLabel(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short'
    });
  }

private calculateDonutData(): void {
  if (!this.orders) return;
  
  const dineIn = this.orders.dineInCount || 0;
  const pickup = this.orders.pickupCount || 0;
  const delivery = this.orders.deliveryCount || 0;
  
  this.totalOrders = dineIn + pickup + delivery;
  
  if (this.totalOrders === 0) {
    this.dineInPercent = 0;
    this.pickupPercent = 0;
    this.deliveryPercent = 0;
    this.dineInCircumference = 0;
    this.pickupCircumference = 0;
    this.deliveryCircumference = 0;
    this.dineInOffset = this.circumference;
    this.pickupOffset = this.circumference;
    this.deliveryOffset = this.circumference;
    return;
  }

  // حساب النسب المئوية
  this.dineInPercent = (dineIn / this.totalOrders) * 100;
  this.pickupPercent = (pickup / this.totalOrders) * 100;
  this.deliveryPercent = (delivery / this.totalOrders) * 100;

  // حساب طول كل قطعة (circumference * النسبة / 100)
  this.dineInCircumference = (this.dineInPercent / 100) * this.circumference;
  this.pickupCircumference = (this.pickupPercent / 100) * this.circumference;
  this.deliveryCircumference = (this.deliveryPercent / 100) * this.circumference;

  // 🔥 التصحيح الحقيقي هنا - طريقة حساب الـ offset الصحيحة لـ SVG
  // القطعة الأولى (Dine-in) تبدأ من 0 - طولها
  // القطعة الثانية (Pickup) تبدأ من - (طول الأولى)
  // القطعة الثالثة (Delivery) تبدأ من - (طول الأولى + طول الثانية)
  
  let accumulatedLength = 0;
  
  // Dine-in offset
  this.dineInOffset = 0;
  accumulatedLength += this.dineInCircumference;
  
  // Pickup offset = - طول Dine-in
  this.pickupOffset = -accumulatedLength;
  accumulatedLength += this.pickupCircumference;
  
  // Delivery offset = - (طول Dine-in + طول Pickup)
  this.deliveryOffset = -accumulatedLength;
  
  console.log('Donut Data:', {
    dineIn: this.dineInPercent.toFixed(1) + '%',
    pickup: this.pickupPercent.toFixed(1) + '%',
    delivery: this.deliveryPercent.toFixed(1) + '%',
    dineInOffset: this.dineInOffset,
    pickupOffset: this.pickupOffset,
    deliveryOffset: this.deliveryOffset
  });
}

  get maxRevenue() {
    return Math.max(...this.dailyRevenue.map(x => x.totalRevenue), 1);
  }

  // ── Weekly Revenue line chart helpers (viewBox 560×160, padding 20px) ──
  private readonly WC_W = 560;
  private readonly WC_H = 160;
  private readonly WC_PAD = 20;

  getDotX(i: number): number {
    const n = this.dailyRevenue.length;
    if (n <= 1) return this.WC_W / 2;
    return this.WC_PAD + (i / (n - 1)) * (this.WC_W - this.WC_PAD * 2);
  }

  getDotY(val: number): number {
    const top = this.WC_PAD + 14;
    const bottom = this.WC_H - this.WC_PAD;
    return bottom - ((val / this.maxRevenue) * (bottom - top));
  }

  getLinePath(): string {
    if (!this.dailyRevenue.length) return '';
    return this.dailyRevenue
      .map((r, i) => `${i === 0 ? 'M' : 'L'}${this.getDotX(i)},${this.getDotY(r.totalRevenue)}`)
      .join(' ');
  }

  getAreaPath(): string {
    if (!this.dailyRevenue.length) return '';
    const bottom = this.WC_H - this.WC_PAD;
    const n = this.dailyRevenue.length;
    const line = this.getLinePath();
    const x0 = this.getDotX(0);
    const xLast = this.getDotX(n - 1);
    return `${line} L${xLast},${bottom} L${x0},${bottom} Z`;
  }

  // ── Revenue Trends sparkline helpers (viewBox 300×90, padding 10px) ──
  private readonly SP_W = 300;
  private readonly SP_H = 90;
  private readonly SP_PAD = 10;

  private get maxSparkRevenue(): number {
    return Math.max(...this.revenue.map(r => r.totalRevenue), 1);
  }

  getSparkX(i: number): number {
    const n = this.revenue.length;
    if (n <= 1) return this.SP_W / 2;
    return this.SP_PAD + (i / (n - 1)) * (this.SP_W - this.SP_PAD * 2);
  }

  getSparkY(val: number): number {
    const top = this.SP_PAD;
    const bottom = this.SP_H - this.SP_PAD;
    return bottom - ((val / this.maxSparkRevenue) * (bottom - top));
  }

  getSparkLinePath(): string {
    if (!this.revenue.length) return '';
    return this.revenue
      .map((r, i) => `${i === 0 ? 'M' : 'L'}${this.getSparkX(i)},${this.getSparkY(r.totalRevenue)}`)
      .join(' ');
  }

  getSparkAreaPath(): string {
    if (!this.revenue.length) return '';
    const bottom = this.SP_H - this.SP_PAD;
    const n = this.revenue.length;
    const line = this.getSparkLinePath();
    const x0 = this.getSparkX(0);
    const xLast = this.getSparkX(n - 1);
    return `${line} L${xLast},${bottom} L${x0},${bottom} Z`;
  }
}