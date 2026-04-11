import { CreateOrderItemInterface } from "./create-order-item-interface";
import { OrderAddressInterface } from "./order-address-interface";

export interface CreateOrderInterface {
    customerId?: string;
  branchId: number;
  orderType: string;
  items: CreateOrderItemInterface[];
  tableId?: number;
  deliveryAddress?: OrderAddressInterface;
  paymentMethod: string;
}
