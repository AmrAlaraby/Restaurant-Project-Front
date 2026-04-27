export interface UpdateAddressDto {
  oldBuildingNumber: number;
  oldStreet: string;
  oldCity: string;
  buildingNumber: number;
  street: string;
  city: string;
  note?: string;
  specialMark?: string;
}
