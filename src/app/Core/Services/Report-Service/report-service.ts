import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardDTO } from '../../Models/ReportModels/dashboard-model';
import { RevenueDTO } from '../../Models/ReportModels/revenue-model';
import { OrdersByTypeDTO } from '../../Models/ReportModels/orders-by-type-model';
import { TopItemsDTO } from '../../Models/ReportModels/top-items-model';
import { InventoryUsageDTO } from '../../Models/ReportModels/inventory-usage-model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private baseUrl = 'https://localhost:44360/api/Reports';
  constructor(private http: HttpClient) {}

  // Dashboard
  getDashboard(): Observable<DashboardDTO> {
    return this.http.get<DashboardDTO>(`${this.baseUrl}/dashboard`);
  }

  // Revenue
  getRevenue(branchId?: number, from?: Date, to?: Date): Observable<RevenueDTO[]> {
    let params = new HttpParams();

    if (branchId) params = params.set('branchId', branchId);
    if (from) params = params.set('from', from.toISOString());
    if (to) params = params.set('to', to.toISOString());

    return this.http.get<RevenueDTO[]>(`${this.baseUrl}/revenue`, { params });
  }

  // Orders By Type
  getOrdersByType(): Observable<OrdersByTypeDTO> {
    return this.http.get<OrdersByTypeDTO>(`${this.baseUrl}/orders-by-type`);
  }

  // Top Items
  getTopItems(top: number = 5): Observable<TopItemsDTO[]> {
    return this.http.get<TopItemsDTO[]>(`${this.baseUrl}/top-items?top=${top}`);
  }

  // Inventory Usage
  getInventoryUsage(): Observable<InventoryUsageDTO[]> {
    return this.http.get<InventoryUsageDTO[]>(`${this.baseUrl}/inventory-usage`);
  }
}
