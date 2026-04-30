import { OrderItem } from "./order-item";

export interface Order {
  id: number;
  orderType: string;
  status: string;
  totalAmount: number;
  itemsCount: number;
  branchName: string | null;
  branchArabicName: string | null;
  createdAt: string;
  items: OrderItem[];
  calculatedTotal: number;
}
