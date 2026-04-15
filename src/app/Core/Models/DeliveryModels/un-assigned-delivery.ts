import { Address } from "./address";

export interface UnAssignedDelivery {
  deliveryId: number;
  orderNumber: string;
  branchName: string;
  userName: string | null;
  itemsCount: number;
  deliveryAddress: Address;
  createdAt: Date;
}
