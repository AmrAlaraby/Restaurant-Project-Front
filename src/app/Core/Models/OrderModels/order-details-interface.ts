import { OrderDeliveryInterface } from "./order-delivery-interface";
import { OrderItemInterface } from "./order-item-interface";
import { OrderKitchenTicketsInterface } from "./order-kitchen-tickets-interface";
import { OrderPaymentInterface } from "./order-payment-interface";

export interface OrderDetailsInterface {
    id: number;
  branchName: string;
  userId: string;
  userName: string;
  orderType: string;
  status: string;
  orderItems: OrderItemInterface[];
  kitchenTickets: OrderKitchenTicketsInterface[];
  payment?: OrderPaymentInterface;
  delivery?: OrderDeliveryInterface;
  totalAmount: number;
  tablenumber?: string;
}
