import { Address } from "./address";
import { Order } from "./order";

export interface Delivery {
  id: number;
  deliveryStatus: string;
  createdAt: string;
  deliveredAt: string | null;
  cashCollected: number | null;
  driverName: string | null;

  order: Order;
  deliveryAddress: Address;
}
