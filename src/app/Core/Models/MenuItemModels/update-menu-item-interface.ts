import { CreateRecipeInterface } from './create-recipe-interface';

export interface UpdateMenuItemInterface {
  name: string;
  price: number;
  prepTimeMinutes: number;
  categoryId: number;
  isAvailable: boolean;
  image?: File | null;
  recipes: CreateRecipeInterface[];
}
