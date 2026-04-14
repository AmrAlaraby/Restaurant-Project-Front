import { OrderItemInterface } from "./order-item-interface";

export interface OrderInterface {
    id: number;
  branchName: string;
  customerId: string;
  customerName: string;
  orderType: string;
  status: string;
  orderItems: OrderItemInterface[];
  totalAmount: number;
}
