import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../../Constants/Api_Urls';
import { map, Observable } from 'rxjs';
import { PaginatedResultInterface } from '../../Models/MenuItemModels/paginated-result-interface';
import { AddedItemsInterface } from '../../Models/OrderModels/added-items-interface';
import { CreateOrderInterface } from '../../Models/OrderModels/create-order-interface';
import { CreateOrderItemInterface } from '../../Models/OrderModels/create-order-item-interface';
import { OrderDetailsInterface } from '../../Models/OrderModels/order-details-interface';
import { OrderInterface } from '../../Models/OrderModels/order-interface';
import { OrderFilters, OrderStatus, OrderType, WaiterOrder } from '../../Models/OrderModels/waiter-order.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}
  createOrder(dto: CreateOrderInterface): Observable<OrderInterface> {
    return this.http.post<OrderInterface>(Order.create, dto);
  }

  // Helper method to clean params
  private buildParams(params: any): any {
  const cleanParams: any = {};

  Object.keys(params).forEach(key => {
    const value = params[key];

    if (value !== null && value !== undefined && value !== '') {
      cleanParams[key] = value;
    }
  });
  return cleanParams;
}


getAllOrders(
  params?: any
): Observable<PaginatedResultInterface<OrderInterface>> {

  const cleanParams = this.buildParams(params);

  return this.http.get<PaginatedResultInterface<OrderInterface>>(
    Order.getAll,
    {
      params: cleanParams
    }
  );
}

  getOrderById(id: number): Observable<OrderDetailsInterface> {
    return this.http.get<OrderDetailsInterface>(Order.getById(id));
  }

  getMyOrders(params?: any): Observable<PaginatedResultInterface<OrderInterface>> {
    return this.http.get<PaginatedResultInterface<OrderInterface>>(Order.myOrders, {
      params,
    });
  }

  updateOrderStatus(orderId: number, status: string): Observable<OrderInterface> {
    console.log(status);

    return this.http.put<OrderInterface>(Order.updateStatus(orderId), JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  addItemsToOrder(
    orderId: number,
    items: CreateOrderItemInterface[],
  ): Observable<AddedItemsInterface> {
    return this.http.post<AddedItemsInterface>(Order.addItems(orderId), items);
  }

  removeItemFromOrder(orderId: number, itemId: number): Observable<OrderInterface> {
    return this.http.delete<OrderInterface>(Order.removeItem(orderId, itemId));
  }

  cancelOrder(orderId: number): Observable<void> {
    return this.http.patch<void>(Order.cancel(orderId), {});
  }
/// ----------------------------- Waiter View Methods -------------------
  private mapToWaiterOrder(order: OrderInterface): WaiterOrder {
    return {
      id: order.id,
      tableNumber: order.tableNumber,
      orderType: order.orderType as OrderType,
      status: order.status as OrderStatus,
      itemsCount: order.orderItems?.length ?? 0,
      totalAmount: order.totalAmount,
    };
  }



  // New method to get orders for waiter view
  getAllOrdersForWaiter(params: OrderFilters) {
    return this.getAllOrders(params).pipe(
      map((res) => ({
        ...res,
        data: res.data.map((o) => this.mapToWaiterOrder(o)),
      })),
    );
  }
}
