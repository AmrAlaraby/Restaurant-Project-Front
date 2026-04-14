import { DeliverySummary } from "./delivery-summary";
import { OrderSummary } from "./order-summary";

export interface UserDetails {
  id: string;
  userName: string;
  email: string;
  name: string;
  roleId: string;
  createdAt: string;
  branchId?: number | null;
  branchName?: string | null;
  orders: OrderSummary[];
  deliveries: DeliverySummary[];
  isDeleted: boolean;
}
