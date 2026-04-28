export interface PaymentDto {
  id: number;
  orderId: number;
  branchId: number;
  branchName: string;
  paymentMethod: string;
  paymentStatus: string;
  paidAmount: number;
  paidAt: string | null;
  createdAt: string | null;
}
