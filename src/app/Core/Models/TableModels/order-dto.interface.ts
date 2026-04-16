export interface OrderDetailsDTO {
  id: number;
  userName: string;
  status: string;
  totalAmount: number;
  tablenumber?: string;
  orderItems: OrderItemDTO[];
}
export interface OrderItemDTO {
  menuItemName: string;
  quantity: number;
  unitPrice: number;
}