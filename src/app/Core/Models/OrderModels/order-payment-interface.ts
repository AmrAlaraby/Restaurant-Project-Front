export interface OrderPaymentInterface {
    paymentMethod: string;
  paymentStatus: string;
  paidAmount: number;
  paidAt?: Date;
}
