import { Address } from "./address";
import { Order } from "./order";

export interface Delivery {
  id: number;
  deliveryStatus: string;
  createdAt: string;
  deliveredAt: string | null;
  cashCollected: number | null;
  driverName: string | null;
 driverNumber: string | null;
  customerPhoneNumber: string | null;
  customerName: string | null;

  order: Order;
  deliveryAddress: Address;
}
