import { OrderStatus, OrderType } from "./waiter-order.model";

export interface CashierOrder {
  id: number;
  orderType: OrderType;
  userName: string;
  itemsCount: number;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;       
  paymentMethod?: PaymentMethod;
}

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export type PaymentMethod = 'Cash' | 'Card' | 'InstaPay' | 'Wallet';
