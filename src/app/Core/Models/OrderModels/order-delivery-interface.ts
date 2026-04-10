import { OrderAddressInterface } from "./order-address-interface";

export interface OrderDeliveryInterface {
    driverId: string;
  driverName?: string;
  deliveredAt?: Date;
  deliveryStatus: string;
  cashCollected?: number;
  deliveryAddress: OrderAddressInterface;
}
