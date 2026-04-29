import { PaymentStatus } from "./cashier-order.model";

export type OrderStatus = 'Received' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled' | 'AwaitingPayment' ;

export type OrderType = 'DineIn' | 'Delivery' | 'PickUp';

export interface OrderFilters {
  pageIndex: number;
  pageSize: number;
  status?: OrderStatus | null;
  paymentStatus?: PaymentStatus | null;
  orderType?: OrderType | null;
  branchId?: number;
  createdAt?: string;
}

export interface WaiterOrder {
  id: number;
  tableNumber?: string;
  orderType: OrderType;
  status: OrderStatus;
  itemsCount: number;
  totalAmount: number;
  createdAt?: string;
}