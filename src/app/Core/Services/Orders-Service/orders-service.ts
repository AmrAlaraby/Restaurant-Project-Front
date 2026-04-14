import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../../Constants/Api_Urls';
import { Observable } from 'rxjs';
import { PaginatedResultInterface } from '../../Models/MenuItemModels/paginated-result-interface';
import { AddedItemsInterface } from '../../Models/OrderModels/added-items-interface';
import { CreateOrderInterface } from '../../Models/OrderModels/create-order-interface';
import { CreateOrderItemInterface } from '../../Models/OrderModels/create-order-item-interface';
import { OrderDetailsInterface } from '../../Models/OrderModels/order-details-interface';
import { OrderInterface } from '../../Models/OrderModels/order-interface';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}
  createOrder(dto: CreateOrderInterface): Observable<OrderInterface> {
    return this.http.post<OrderInterface>(Order.create, dto);
  }

  getAllOrders(params?: any): Observable<PaginatedResultInterface<OrderInterface>> {
    return this.http.get<PaginatedResultInterface<OrderInterface>>(Order.getAll, {
      params
    });
  }

  getOrderById(id: number): Observable<OrderDetailsInterface> {
    return this.http.get<OrderDetailsInterface>(Order.getById(id));
  }

  getMyOrders(params?: any): Observable<PaginatedResultInterface<OrderInterface>> {
    return this.http.get<PaginatedResultInterface<OrderInterface>>(Order.myOrders, {
      params
    });
  }

  updateOrderStatus(
    orderId: number,
    status: string
  ): Observable<OrderInterface> {
    console.log(status);
    
    return this.http.put<OrderInterface>(
      Order.updateStatus(orderId),JSON.stringify(status), {
  headers: { 'Content-Type': 'application/json' }
});
  }

  addItemsToOrder(
    orderId: number,
    items: CreateOrderItemInterface[]
  ): Observable<AddedItemsInterface> {
    return this.http.post<AddedItemsInterface>(
      Order.addItems(orderId),
      items
    );
  }

  removeItemFromOrder(
    orderId: number,
    itemId: number
  ): Observable<OrderInterface> {
    return this.http.delete<OrderInterface>(
      Order.removeItem(orderId, itemId)
    );
  }

  cancelOrder(orderId: number): Observable<void> {
    return this.http.patch<void>(
      Order.cancel(orderId),
      {}
    );
  }
}
