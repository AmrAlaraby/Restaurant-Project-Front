import { CreateOrderItemInterface } from "./create-order-item-interface";

export interface AddedItemsInterface {
    orderID: number;
  addedItems: CreateOrderItemInterface[];
}
