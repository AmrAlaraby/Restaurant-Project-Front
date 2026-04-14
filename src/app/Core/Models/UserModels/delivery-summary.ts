import { DeliveryAddress } from "./delivery-address";

export interface DeliverySummary {
  id: number;
  deliveryStatus: string;
  deliveredAt: string;
  cashCollected?: number | null;
  deliveryAddress: DeliveryAddress;
}
