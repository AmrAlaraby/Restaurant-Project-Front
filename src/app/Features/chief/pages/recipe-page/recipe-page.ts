import { Component, signal, viewChild } from '@angular/core';
import { RecipesListDTO } from '../../../../Core/Models/RecipeModels/recipes-list-dto';
import { AddRecipeComponent } from '../../components/Recipes/add-recipe/add-recipe';
import { EditRecipeComponent } from '../../components/Recipes/edit-recipe/edit-recipe';
import { RecipeListComponent } from '../../components/Recipes/recipe-list/recipe-list';
import { TranslatePipe } from '@ngx-translate/core';



@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [RecipeListComponent, AddRecipeComponent, EditRecipeComponent, TranslatePipe],
  templateUrl: './recipe-page.html',
  styleUrls: ['./recipe-page.scss'],
})
export class RecipeListPage {
  showAddModal   = signal(false);
  selectedRecipe = signal<RecipesListDTO | null>(null);

  private recipesTable = viewChild(RecipeListComponent);

  onEditRequested(recipe: RecipesListDTO): void {
    this.selectedRecipe.set(recipe);
  }

  onSaved(): void {
    this.showAddModal.set(false);
    this.selectedRecipe.set(null);
    this.recipesTable()?.loadRecipes();
  }
}
