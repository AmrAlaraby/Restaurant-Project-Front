import { OrderItemInterface } from "./order-item-interface";

export interface OrderInterface {
    id: number;
    branchId: number;
  branchName: string;
  userId: string;
  userName: string;
  orderType: string;
  status: string;
  orderItems: OrderItemInterface[];
  totalAmount: number;
  tableNumber?: string;
  paymentMethod?: string;
  paymentStatus: string;
}
