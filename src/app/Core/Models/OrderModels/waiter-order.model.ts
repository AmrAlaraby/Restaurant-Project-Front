// Order Status
export type OrderStatus = 'Received' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';

// Order Type
export type OrderType = 'DineIn' | 'Delivery' | 'Pickup';

// Filters
export interface OrderFilters {
  pageIndex: number;
  pageSize: number;
  status?: OrderStatus | null;
  orderType?: OrderType | null;
}

// UI Model
export interface WaiterOrder {
  id: number;
  tableNumber?: string;
  orderType: OrderType;
  status: OrderStatus;
  itemsCount: number;
  totalAmount: number;
}
