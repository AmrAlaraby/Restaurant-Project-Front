export interface MenuItemInterface {
  id: number;
  name: string;
  price: number;
  isAvailable: boolean;
  categoryId: number;
  prepTimeMinutes: number;
  category: string;
  imageUrl: string;
}
