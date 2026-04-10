export interface BranchDto {
  id: number;
  name: string;
  phone: string;
  isActive: boolean;

  // Address
  buildingNumber: number;
  street: string;
  city: string;
  note?: string;
  specialMark?: string;
}
