import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableOrders, Tables } from '../../Constants/Api_Urls';
import { ApiResponse } from '../../Models/AuthModels/api-response';
import { TableInterface } from '../../Models/TableModules/table-interface';
import { CreateTableInterface } from '../../Models/TableModules/create-table-interface';
import { UpdateTableStatusInterface } from '../../Models/TableModules/update-table-status-interface';
import { TableOrderInterface } from '../../Models/TableModules/table-order-interface';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  constructor(private http: HttpClient) {}

  getAllTables(branchId?: number, isOccupied?: boolean): Observable<TableInterface[]> {
    let params: any = {};
    if (branchId) params['branchId'] = branchId;
    if (isOccupied !== undefined) params['isOccupied'] = isOccupied;
    return this.http.get<TableInterface[]>(Tables.getAll, { params });
  }

  getTableById(id: number): Observable<TableInterface> {
    return this.http.get<TableInterface>(Tables.getById(id));
  }

  createTable(dto: CreateTableInterface): Observable<TableInterface> {
    return this.http.post<TableInterface>(Tables.create, dto);
  }

  updateTableStatus(id: number, dto: UpdateTableStatusInterface): Observable<TableInterface> {
    return this.http.patch<TableInterface>(Tables.updateStatus(id), dto);
  }

  deleteTable(id: number): Observable<void> {
    return this.http.delete<void>(Tables.delete(id));
  }

  getAllTableOrders(tableId?: number, active?: boolean): Observable<TableOrderInterface[]> {
    let params: any = {};
    if (tableId) params['tableId'] = tableId;
    if (active !== undefined) params['active'] = active;
    return this.http.get<TableOrderInterface[]>(TableOrders.getAll, { params });
  }

  completeTableOrder(id: number): Observable<TableOrderInterface> {
    return this.http.patch<TableOrderInterface>(TableOrders.complete(id), {});
  }
}
