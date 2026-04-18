import { Address } from './address';
import { OrderItem } from './order-item';

export interface UnAssignedDelivery {
  deliveryId: number;
  orderNumber: string;
  branchName: string;
  userName: string | null;
  itemsCount: number;
  deliveryAddress: Address;
  createdAt: Date;

  // الـ API بيرجعهم — بنستخدمهم لحساب totalAmount
  order?: {
    items?: OrderItem[];
    calculatedTotal?: number;
    totalAmount?: number;
  };
}
