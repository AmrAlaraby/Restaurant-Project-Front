import { TicketStatus } from "./ticket-status";

export interface KitchenTicketDetailsDto {
  id: number;
  station: string;
  status: TicketStatus;
  startedAt: string | null;
  completedAt: string | null;
  orderId: number;
  items: string[];
}
