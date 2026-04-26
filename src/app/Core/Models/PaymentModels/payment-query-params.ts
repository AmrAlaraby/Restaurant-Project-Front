export interface PaymentQueryParams {
  orderId?: number;
  status?: string;
  method?: string;
  branchId?: number;
  pageIndex?: number;
  pageSize?: number;
}
