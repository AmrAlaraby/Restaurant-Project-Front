export interface RecipesListInterface {
  menuItemId: number;
  menuItemName: string;
  menuItemArabicName: string;
  ingredientId: number;
  ingredientName: string;
  ingredientArabicName: string;
  quantityRequired: number;
  unit: string;
}

export interface MenuItemDetailsInterface {
  id: number;
  name: string;
  arabicName: string;
  price: number;
  isAvailable: boolean;
  prepTimeMinutes: number;
  categoryName: string;
  categoryArabicName: string;
  categoryId: number;
  imageUrl: string;
  recipes: RecipesListInterface[];

}
