export interface CreateBranch {
  name: string;
  phone: string;
  buildingNumber: number;
  street: string;
  city: string;
  note?: string | null;
  specialMark?: string | null;
}
