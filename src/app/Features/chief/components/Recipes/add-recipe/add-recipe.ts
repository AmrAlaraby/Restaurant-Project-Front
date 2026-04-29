import { Component, OnInit, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { IngredientsService } from '../../../../../Core/Services/Ingredients-Service/ingredients-Service';

import { MenuItemInterface } from '../../../../../Core/Models/MenuItemModels/menu-item-interface';
import { IngredientInterface } from '../../../../../Core/Models/MenuItemModels/ingredient-interface';
import { MenuItemsService } from '../../../../../Core/Services/Menu-Item-Service/menu-item-service';
import { RecipesService } from '../../../../../Core/Services/Recipe-Service/recipes-service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';
import { ToastService } from '../../../../../Core/Services/Toast-Service/toast-service';

@Component({
  selector: 'app-add-recipe',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './add-recipe.html',
  styleUrls: ['./add-recipe.scss'],
})
export class AddRecipeComponent implements OnInit {
  private readonly menuItemsService   = inject(MenuItemsService);
  private readonly ingredientsService = inject(IngredientsService);
  private readonly recipesService     = inject(RecipesService);
   private readonly toast             = inject(ToastService);

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
  constructor(
          private localizationService: LocalizationService,
        ) {}
  ngOnInit(): void {
    this.menuItemsService.getAll({ pageSize: 100 }).subscribe({
      next: (res) => this.menuItems.set(res.data),
       error: () => this.toast.error('Failed to load menu items'),
    });

    this.ingredientsService.getAll(1, 100).subscribe({
      next: (res) => this.ingredients.set(res.data),
       error: () => this.toast.error('Failed to load ingredients'),
    });
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

  // ── Actions ───────────────────────────────────────────────────
  submit(): void {
    if (!this.form.menuItemId || !this.form.ingredientId || this.form.quantityRequired <= 0) {
      this.error.set('Please fill all fields correctly.');
      return;
    }

    this.isSubmitting.set(true);
     this.toast.success('Recipe added successfully!');
    this.error.set(null);

    this.recipesService.addRecipe(this.form).subscribe({
      next: () => {
        this.isSubmitting.set(false);
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
      return item.arabicName || item.name;
    }
    return item.name;
  }

  getItemName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.arabicName || item.name;
    }
    return item.name;
  }
}
