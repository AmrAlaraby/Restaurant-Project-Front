import { CreateRecipeInterface } from './create-recipe-interface';

export interface CreateMenuItemInterface {
  name: string;
  arabicName: string;
  price: number;
  prepTimeMinutes: number;
  categoryId: number;
  image: File;
  recipes: CreateRecipeInterface[];
}
