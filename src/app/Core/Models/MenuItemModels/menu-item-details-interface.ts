export interface RecipesListInterface {
  menuItemId: number;
  menuItemName: string;
  ingredientId: number;
  ingredientName: string;
  quantityRequired: number;
  unit: string;
}

export interface MenuItemDetailsInterface {
  id: number;
  name: string;
  price: number;
  isAvailable: boolean;
  prepTimeMinutes: number;
  categoryName: string;
  categoryId: number;
  imageUrl: string;
  recipes: RecipesListInterface[];
}
