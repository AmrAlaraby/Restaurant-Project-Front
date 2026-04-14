export type OrderStatus = 'Received' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';

export type OrderType = 'DineIn' | 'Delivery' | 'Pickup';

export interface OrderFilters {
  pageIndex: number;
  pageSize: number;
  status?: OrderStatus | null;
  orderType?: OrderType | null;
  branchId?: number;
}

export interface WaiterOrder {
  id: number;
  tableNumber?: string;
  orderType: OrderType;
  status: OrderStatus;
  itemsCount: number;
  totalAmount: number;
}