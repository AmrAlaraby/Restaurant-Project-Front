import { DeliveryAddress } from "./delivery-address";

export interface CustomerInterface {
  id: string;
  name: string;
  phoneNumber: string;
  addresses: DeliveryAddress[];
}
