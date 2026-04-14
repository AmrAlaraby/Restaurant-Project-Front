import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BranchStock } from '../../Constants/Api_Urls';
import { BranchStockInterface } from '../../Models/BranchStockModels/BranchStockInterface';
import { UpdateBranchStockInterface } from '../../Models/BranchStockModels/UpdateBranchStockInterface';
import { PaginatedResultInterface } from '../../Models/MenuItemModels/paginated-result-interface';

@Injectable({
  providedIn: 'root',
})
export class BranchStockService {
  private http = inject(HttpClient);

  getAll(pageIndex = 1, pageSize = 10): Observable<PaginatedResultInterface<BranchStockInterface>> {
    return this.http.get<PaginatedResultInterface<BranchStockInterface>>(
      `${BranchStock.getAll}?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
  }

  getById(id: number): Observable<BranchStockInterface> {
    return this.http.get<BranchStockInterface>(BranchStock.getById(id));
  }

  update(id: number, data: UpdateBranchStockInterface): Observable<BranchStockInterface> {
    return this.http.patch<BranchStockInterface>(BranchStock.update(id), data);
  }
}