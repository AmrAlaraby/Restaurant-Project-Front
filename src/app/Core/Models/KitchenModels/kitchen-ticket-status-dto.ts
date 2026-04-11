import { TicketStatus } from "./ticket-status";

export interface KitchenTicketStatusDto {
  id: number;
  status: TicketStatus;
  startedAt: string | null;
  completedAt: string | null;
  isOrderReady: boolean;
}
