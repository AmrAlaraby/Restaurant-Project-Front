import { OrderKitchenTicketDTO } from "./order-kitchen-ticket-dto";

export interface KitchenBoardDto {
  pending: OrderKitchenTicketDTO[];
  preparing: OrderKitchenTicketDTO[];
  done: OrderKitchenTicketDTO[];
}
