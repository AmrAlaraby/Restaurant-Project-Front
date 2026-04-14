export interface UpdateBranch {
  name: string;
  phone: string;
  isActive: boolean;
  buildingNumber: number;
  street: string;
  city: string;
  note?: string | null;
  specialMark?: string | null;
}
