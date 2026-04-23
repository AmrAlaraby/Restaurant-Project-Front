import { Component, inject, signal, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipesListDTO } from '../../../../../Core/Models/RecipeModels/recipes-list-dto';
import { RecipesService } from '../../../../../Core/Services/Recipe-Service/recipes-service';



@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-recipe.html',
  styleUrls: ['./edit-recipe.scss'],
})
export class EditRecipeComponent implements OnInit {
  private readonly recipesService = inject(RecipesService);

  // ── Inputs / Outputs ─────────────────────────────────────────
  recipe    = input.required<RecipesListDTO>();
  saved     = output<void>();
  cancelled = output<void>();

  // ── Form ─────────────────────────────────────────────────────
  quantityRequired = signal(0);
  isSubmitting     = signal(false);
  error            = signal<string | null>(null);

  ngOnInit(): void {
    this.quantityRequired.set(this.recipe().quantityRequired);
  }

  // ── Actions ──────────────────────────────────────────────────
  submit(): void {
    if (this.quantityRequired() <= 0) {
      this.error.set('Quantity must be greater than 0.');
      return;
    }

    this.isSubmitting.set(true);
    this.error.set(null);

    this.recipesService
      .updateRecipe(this.recipe().ingredientId, { quantityRequired: this.quantityRequired() })
      .subscribe({
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
