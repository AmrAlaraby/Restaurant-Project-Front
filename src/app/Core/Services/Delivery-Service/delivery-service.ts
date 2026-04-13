import { User } from './../../Models/DeliveryModels/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedResult } from '../../Models/DeliveryModels/paginated-result';
import { Delivery } from '../../Models/DeliveryModels/delivery';
import { Deliveries, Branch } from '../../Constants/Api_Urls';
import { UnAssignedDelivery } from '../../Models/DeliveryModels/un-assigned-delivery';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  constructor(private http: HttpClient) {}

  getAll(pageIndex = 1, pageSize = 5, filters: any = {}) {
    let params: any = { pageIndex, pageSize };

    if (filters.branchId) params.branchId = filters.branchId;
    if (filters.status) params.status = filters.status;
    if (filters.date) params.date = filters.date;
    if (filters.orderId) params.orderId = filters.orderId;

    return this.http.get<PaginatedResult<Delivery>>(Deliveries.getAll, { params });
  }

  getById(id: number) {
    return this.http.get<Delivery>(`${Deliveries.getById}?id=${id}`);
  }

  updateStatus(id: number, body: { status: string; cashCollected?: number }) {
    const token = localStorage.getItem('token');
    return this.http.patch<Delivery>(Deliveries.updateStatus(id), body, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getUnAssignedDeliveries(): Observable<UnAssignedDelivery[]> {
    return this.http.get<UnAssignedDelivery[]>(Deliveries.unassigned);
  }

  getAvailableDriversByBranch(branchId: number): Observable<any> {
    return this.http.get<any>(Deliveries.availableDrivers, {
      params: {
        branchId: branchId.toString(),
      },
    });
  }

  assignDelivery(dto: any): Observable<any> {
    return this.http.post(Deliveries.assign, dto);
  }

  getBranches(): Observable<any> {
    return this.http.get<any>(Branch.getAll);
  }


  getOwnAssignedDeliveries(): Observable<any> {
  return this.http.get<any>(Deliveries.ownAssigned);
}
}
