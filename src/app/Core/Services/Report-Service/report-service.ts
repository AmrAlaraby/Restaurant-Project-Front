import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Reports } from '../../Constants/Api_Urls';

import { DashboardDTO } from '../../Models/ReportModels/dashboard-model';
import { RevenueDTO } from '../../Models/ReportModels/revenue-model';
import { OrdersByTypeDTO } from '../../Models/ReportModels/orders-by-type-model';
import { TopItemsDTO } from '../../Models/ReportModels/top-items-model';
import { InventoryUsageDTO } from '../../Models/ReportModels/inventory-usage-model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private http = inject(HttpClient);

  // Dashboard
  getDashboard(): Observable<DashboardDTO> {
    return this.http.get<DashboardDTO>(Reports.dashboard);
  }

  // Revenue
  getRevenue(branchId?: number, from?: Date, to?: Date): Observable<RevenueDTO[]> {
    let params = new HttpParams();

    if (branchId) params = params.set('branchId', branchId);
    if (from) params = params.set('from', from.toISOString());
    if (to) params = params.set('to', to.toISOString());

    return this.http.get<RevenueDTO[]>(Reports.revenue, { params });
  }

  // Orders By Type
  getOrdersByType(): Observable<OrdersByTypeDTO> {
    return this.http.get<OrdersByTypeDTO>(Reports.ordersByType);
  }

  // Top Items
  getTopItems(top: number = 5): Observable<TopItemsDTO[]> {
    return this.http.get<TopItemsDTO[]>(`${Reports.topItems}?top=${top}`);
  }

  // Inventory Usage
  getInventoryUsage(): Observable<InventoryUsageDTO[]> {
    return this.http.get<InventoryUsageDTO[]>(Reports.inventoryUsage);
  }
}