import { Component, inject, signal, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipesListDTO } from '../../../../../Core/Models/RecipeModels/recipes-list-dto';
import { RecipesService } from '../../../../../Core/Services/Recipe-Service/recipes-service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';
import { ToastService } from '../../../../../Core/Services/Toast-Service/toast-service';



@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './edit-recipe.html',
  styleUrls: ['./edit-recipe.scss'],
})
export class EditRecipeComponent implements OnInit {
  private readonly recipesService = inject(RecipesService);
    private readonly toast          = inject(ToastService);

  // ── Inputs / Outputs ─────────────────────────────────────────
  recipe    = input.required<RecipesListDTO>();
  saved     = output<void>();
  cancelled = output<void>();

  // ── Form ─────────────────────────────────────────────────────
  quantityRequired = signal(0);
  isSubmitting     = signal(false);
  error            = signal<string | null>(null);

  constructor(
        private localizationService: LocalizationService,
      ) {}

  ngOnInit(): void {
    this.quantityRequired.set(this.recipe().quantityRequired);
    this.getCurrentLanguage();
  }

  CurrentLanguage: string = 'en';
    
      private destroy$ = new Subject<void>();
      getCurrentLanguage(): void {
        this.CurrentLanguage = this.localizationService.getCurrentLang();
        this.localizationService.currentLang$.pipe(takeUntil(this.destroy$)).subscribe((lang) => {
          this.CurrentLanguage = lang;
        });
      }
    
      ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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
          this.toast.success('Recipe updated successfully!');
          this.saved.emit();
        },
        error: (err) => {
         const msg = err?.error ?? 'Something went wrong.';
          this.error.set(msg);
          this.toast.error(msg);
          this.isSubmitting.set(false);
        },
      });
  }

  cancel(): void {
    this.cancelled.emit();
  }

  getIngredientName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.ingredientArabicName || item.ingredientName;
    }
    return item.ingredientName;
  }
  getItemName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.menuItemArabicName || item.menuItemName;
    }
    return item.menuItemName;
  }
}
