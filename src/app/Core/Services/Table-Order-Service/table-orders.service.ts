import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { TableOrderInterface } from '../../Models/TableModels/table-order-interface';
import { OrderDetailsDTO } from '../../Models/TableModels/order-dto.interface';
import { TableOrders, Order as OrderApi } from '../../Constants/Api_Urls';

@Injectable({
  providedIn: 'root',
})
export class TableOrdersService {
  private http = inject(HttpClient);

  getActiveOrder(tableId: number): Observable<{ orderId: number }[]> {
    let params = new HttpParams().set('tableId', tableId).set('active', true);

    return this.http.get<{ orderId: number }[]>(TableOrders.getAll, { params });
  }

 
  getOrderDetails(orderId: number): Observable<TableOrderInterface> {
    return this.http.get<OrderDetailsDTO>(OrderApi.getById(orderId)).pipe(
      map((res) => ({
        id: res.id,
        userName: res.userName,
        status: res.status,
        totalAmount: res.totalAmount,
        tableNumber: res.tablenumber,
        items: res.orderItems.map((item) => ({
          name: item.menuItemName,
          arabicName: item.arabicMenuItemName,
          quantity: item.quantity,
          price: item.unitPrice,
        })),
      })),
    );
  }
}
