import { TicketStatus } from "./ticket-status";

export interface KitchenTicketQueryParams {
  branchId?: number | null;
  orderId?: number | null;
  station?: string | null;
  status?: TicketStatus | null;
}


