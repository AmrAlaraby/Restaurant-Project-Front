import { Component, OnInit, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { IngredientsService } from '../../../../../Core/Services/Ingredients-Service/ingredients-Service';

import { MenuItemInterface } from '../../../../../Core/Models/MenuItemModels/menu-item-interface';
import { IngredientInterface } from '../../../../../Core/Models/MenuItemModels/ingredient-interface';
import { MenuItemsService } from '../../../../../Core/Services/Menu-Item-Service/menu-item-service';
import { RecipesService } from '../../../../../Core/Services/Recipe-Service/recipes-service';

@Component({
  selector: 'app-add-recipe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-recipe.html',
  styleUrls: ['./add-recipe.scss'],
})
export class AddRecipeComponent implements OnInit {
  private readonly menuItemsService   = inject(MenuItemsService);
  private readonly ingredientsService = inject(IngredientsService);
  private readonly recipesService     = inject(RecipesService);

  // ── Outputs ──────────────────────────────────────────────────
  saved     = output<void>();   // نجح الـ submit → الـ parent يعمل reload
  cancelled = output<void>();   // ضغط Cancel

  // ── Dropdown data ─────────────────────────────────────────────
  menuItems   = signal<MenuItemInterface[]>([]);
  ingredients = signal<IngredientInterface[]>([]);

  // ── Form model ────────────────────────────────────────────────
  form = {
    menuItemId:       0,
    ingredientId:     0,
    quantityRequired: 0,
  };

  isSubmitting = signal(false);
  error        = signal<string | null>(null);

  // ── Lifecycle ─────────────────────────────────────────────────
  ngOnInit(): void {
    this.menuItemsService.getAll({ pageSize: 100 }).subscribe({
      next: (res) => this.menuItems.set(res.data),
    });

    this.ingredientsService.getAll(1, 100).subscribe({
      next: (res) => this.ingredients.set(res.data),
    });
  }

  // ── Actions ───────────────────────────────────────────────────
  submit(): void {
    if (!this.form.menuItemId || !this.form.ingredientId || this.form.quantityRequired <= 0) {
      this.error.set('Please fill all fields correctly.');
      return;
    }

    this.isSubmitting.set(true);
    this.error.set(null);

    this.recipesService.addRecipe(this.form).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.saved.emit();
      },
      error: (err) => {
        this.error.set(err?.error ?? 'Something went wrong.');
        this.isSubmitting.set(false);
      },
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
