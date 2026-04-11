import { CreateMenuItemInterface } from '../Models/MenuItemModels/create-menu-item-interface';
import { UpdateMenuItemInterface } from '../Models/MenuItemModels/update-menu-item-interface';

export class MenuItemFormDataHelper {
  static buildCreate(dto: CreateMenuItemInterface): FormData {
    const formData = new FormData();

    formData.append('Name', dto.name);
    formData.append('Price', dto.price.toString());
    formData.append('PrepTimeMinutes', dto.prepTimeMinutes.toString());
    formData.append('CategoryId', dto.categoryId.toString());
    formData.append('Image', dto.image);

    dto.recipes.forEach((recipe, index) => {
      formData.append(`Recipes[${index}].IngredientId`, recipe.ingredientId.toString());

      formData.append(`Recipes[${index}].QuantityRequired`, recipe.quantityRequired.toString());
    });

    return formData;
  }

  static buildUpdate(dto: UpdateMenuItemInterface): FormData {
    const formData = new FormData();

    formData.append('Name', dto.name);
    formData.append('Price', dto.price.toString());
    formData.append('PrepTimeMinutes', dto.prepTimeMinutes.toString());
    formData.append('CategoryId', dto.categoryId.toString());
    formData.append('IsAvailable', dto.isAvailable.toString());

    if (dto.image) {
      formData.append('Image', dto.image);
    }

    dto.recipes.forEach((recipe, index) => {
      formData.append(`Recipes[${index}].IngredientId`, recipe.ingredientId.toString());

      formData.append(`Recipes[${index}].QuantityRequired`, recipe.quantityRequired.toString());
    });

    return formData;
  }
}
