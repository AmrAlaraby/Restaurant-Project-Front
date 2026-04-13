import { Address } from "./address";

export interface UnAssignedDelivery {
  deliveryId: number;
  orderNumber: string;
  branchName: string;
  customerName: string | null;
  itemsCount: number;
  deliveryAddress: Address;
  createdAt: Date;
}
