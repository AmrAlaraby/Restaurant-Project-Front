import { TicketStatus } from "./ticket-status";

export interface OrderKitchenTicketDTO {
  id: number;
  orderId: number;
  station: string;
  status: TicketStatus;
  startedAt: string | null;
  completedAt: string | null;
}
