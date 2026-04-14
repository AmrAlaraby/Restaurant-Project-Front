import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TableQueryParamsInterface } from '../../Models/TableModels/table-query-params-interface';
import { Observable } from 'rxjs';
import { PaginatedResultInterface } from '../../Models/MenuItemModels/paginated-result-interface';
import { TableInterface } from '../../Models/TableModels/table-interface';
import { Tables } from '../../Constants/Api_Urls';


@Injectable({
  providedIn: 'root',
})
export class TableService {
  private http = inject(HttpClient);


  getTables(
    paramsObj: TableQueryParamsInterface,
  ): Observable<PaginatedResultInterface<TableInterface>> {
    let params = new HttpParams()
      .set('pageIndex', paramsObj.pageIndex)
      .set('pageSize', paramsObj.pageSize);

    if (paramsObj.branchId) {
      params = params.set('branchId', paramsObj.branchId);
    }

    if (paramsObj.isOccupied !== undefined) {
      params = params.set('isOccupied', paramsObj.isOccupied);
    }
    if (paramsObj.search) {
      params = params.set('search', paramsObj.search);
    }

    return this.http.get<PaginatedResultInterface<TableInterface>>(Tables.getAll, { params });
  }

 
  toggleStatus(id: number): Observable<void> {
    return this.http.patch<void>(Tables.updateStatus(id), {});
  }


  deleteTable(id: number): Observable<void> {
    return this.http.delete<void>(Tables.delete(id));
  }

  createTable(data: { tableNumber: string; capacity: number; branchId: number }) {
    return this.http.post(Tables.create, data);
  }

  updateTable(
    id: number,
    data: {
      tableNumber: string;
      capacity: number;
    },
  ) {
    return this.http.patch(Tables.update(id), data);
  }
}
