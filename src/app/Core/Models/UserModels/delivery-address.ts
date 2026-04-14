export interface DeliveryAddress {
  buildingNumber: number;
  street: string;
  city: string;
  note?: string | null;
  specialMark?: string | null;
}
