import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MenuItems } from '../../Constants/Api_Urls';
import { MenuItemInterface } from '../../Models/MenuItemModels/menu-item-interface';
import { MenuItemDetailsInterface } from '../../Models/MenuItemModels/menu-item-details-interface';;
import { PaginatedResultInterface } from '../../Models/MenuItemModels/paginated-result-interface';
import { MenuItemQueryParamsInterface } from '../../Models/MenuItemModels/menu-item-query-params-interface';
import { CreateMenuItemInterface } from '../../Models/MenuItemModels/create-menu-item-interface';
import { UpdateMenuItemInterface } from '../../Models/MenuItemModels/update-menu-item-interface';
import { MenuItemFormDataHelper } from '../../Helpers/menu-item-form-data.helper';
import { MenuItemsStatsInterface } from '../../Models/MenuItemModels/menu-items-stats-interface';

@Injectable({
  providedIn: 'root',
})
export class MenuItemsService {
  private http = inject(HttpClient);

  getAll(
    paramsObj: MenuItemQueryParamsInterface,
  ): Observable<PaginatedResultInterface<MenuItemInterface>> {
    let params = new HttpParams();

    Object.entries(paramsObj).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params = params.append(key, value);
      }
    });

    return this.http.get<PaginatedResultInterface<MenuItemInterface>>(MenuItems.getAll, { params });
  }

  getById(id: number): Observable<MenuItemDetailsInterface> {
    return this.http.get<MenuItemDetailsInterface>(MenuItems.getById(id));
  }

  create(dto: CreateMenuItemInterface): Observable<MenuItemDetailsInterface> {
    return this.http.post<MenuItemDetailsInterface>(
      MenuItems.create,
      MenuItemFormDataHelper.buildCreate(dto),
    );
  }

  update(id: number, dto: UpdateMenuItemInterface): Observable<MenuItemDetailsInterface> {
    return this.http.put<MenuItemDetailsInterface>(
      MenuItems.update(id),
      MenuItemFormDataHelper.buildUpdate(dto),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(MenuItems.delete(id));
  }

  toggleAvailability(id: number): Observable<void> {
    return this.http.patch<void>(MenuItems.toggleAvailability(id), {});
  }

  getPopular(branchId?: number) {
    return this.http.get<MenuItemInterface[]>(MenuItems.popular, {
      params: branchId ? { branchId } : {}
    });
  }
getStats() {
  return this.http.get<MenuItemsStatsInterface>(MenuItems.stats);
}
}
