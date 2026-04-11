export interface TableOrderInterface {
  id: number;
  tableId: number;
  orderId: number;
  seatedAt: string;
  completedAt: string | null;
}