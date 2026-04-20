import { TicketStatus } from "../KitchenModels/ticket-status";

export interface OrderKitchenTicketsInterface {
    id: number;
  station: string;
  status: TicketStatus;
  startedAt?: Date;
  completedAt?: Date;
}
