export interface OrderItem {
  menuItemName: string;
  menuItemArabicName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes: string | null;
}
