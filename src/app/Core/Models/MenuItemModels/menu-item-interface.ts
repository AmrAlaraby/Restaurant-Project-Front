export interface MenuItemInterface {
  id: number;
  name: string;
  arabicName: string;
  price: number;
  isAvailable: boolean;
  categoryId: number;
  prepTimeMinutes: number;
  category: string;
  categoryArabicName: string;
  imageUrl: string;
}
