import { TableOrderItemsInterface } from "./table-order-items-interface";

export interface TableOrderInterface {
  id: number;
  userName: string;
  status: string;
  totalAmount: number;
  tableNumber?: string;
  items: TableOrderItemsInterface[];
}