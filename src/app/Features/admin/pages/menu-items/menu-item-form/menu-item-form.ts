import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';


import { CategoryInterface } from '../../../../../Core/Models/MenuItemModels/category-interface';
import { MenuItemsService } from '../../../../../Core/Services/Menu-Item-Service/menu-item-service';
import { CategoriesService } from '../../../../../Core/Services/Categories-Service/categories-service';
import { ImageUpload } from '../components/image-upload/image-upload';
import { IngredientInterface } from '../../../../../Core/Models/MenuItemModels/ingredient-interface';
import { IngredientsService } from '../../../../../Core/Services/Ingredients-Service/ingredients-Service';
import { UpdateMenuItemInterface } from '../../../../../Core/Models/MenuItemModels/update-menu-item-interface';
import { CreateMenuItemInterface } from '../../../../../Core/Models/MenuItemModels/create-menu-item-interface';
@Component({
  selector: 'app-menu-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImageUpload],
  templateUrl: './menu-item-form.html',
  styleUrls: ['./menu-item-form.scss'],
})
export class MenuItemForm implements OnInit, OnChanges {
  form!: FormGroup;

  categories: CategoryInterface[] = [];

  @Input() isEditMode = false;

  @Input() menuItemId?: number;

  @Output() formSubmitted = new EventEmitter<void>();

  @Output() cancelled = new EventEmitter<void>();

  // ------ properties ------
  ingredients: IngredientInterface[] = [];
  loading = false;
  selectedImageFile?: File;
  currentImageUrl?: string;

  constructor(
    private fb: FormBuilder,
    private menuItemsService: MenuItemsService,
    private categoriesService: CategoriesService,
    private ingredientService: IngredientsService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
    this.loadIngredients();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['menuItemId'] && this.menuItemId && this.isEditMode) {
      this.loadMenuItem();
    }
  }
  initializeForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      prepTimeMinutes: [null, [Validators.required, Validators.min(1)]],
      categoryId: [null, Validators.required],
      isAvailable: [true],
      recipes: this.fb.array([]),
    });
  }

  loadCategories(): void {
    this.categoriesService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
    });
  }

  loadIngredients(): void {
    this.ingredientService.getAll().subscribe({
      next: (ingredients) => {
        this.ingredients = ingredients;
      },
    });
  }

  loadMenuItem(): void {
    if (!this.menuItemId) return;

    this.loading = true;

    this.menuItemsService.getById(this.menuItemId).subscribe({
      next: (menuItem) => {
        this.form.patchValue({
          name: menuItem.name,
          price: menuItem.price,
          prepTimeMinutes: menuItem.prepTimeMinutes,
          categoryId: menuItem.categoryId,
          isAvailable: menuItem.isAvailable,
        });
        this.currentImageUrl = menuItem.imageUrl;
        this.loading = false;
        this.recipes.clear();

        menuItem.recipes.forEach((recipe) => {
          this.recipes.push(
            this.fb.group({
              ingredientId: recipe.ingredientId,
              quantityRequired: recipe.quantityRequired,
            }),
          );
        });
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onImageSelected(file: File): void {
    this.selectedImageFile = file;
  }

  // onSubmit(): void {
  //   if (this.form.invalid) {
  //     this.form.markAllAsTouched();
  //     return;
  //   }

  //   console.log('Submitted:', this.form.value);

  //   this.formSubmitted.emit();
  // }
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const formValue = this.form.value;

    if (this.isEditMode && this.menuItemId) {
      const updateDto: UpdateMenuItemInterface = {
        ...formValue,
        image: this.selectedImageFile,
      };

      this.menuItemsService.update(this.menuItemId, updateDto).subscribe({
        next: () => {
          this.loading = false;
          this.formSubmitted.emit();
        },
        error: (error) => {
          console.error(error);
          this.loading = false;
        },
      });

      return;
    }

    if (!this.selectedImageFile) {
      alert('Image is required.');
      this.loading = false;
      return;
    }

    const createDto: CreateMenuItemInterface = {
      ...formValue,
      image: this.selectedImageFile,
    };

    this.menuItemsService.create(createDto).subscribe({
      next: () => {
        this.loading = false;
        this.formSubmitted.emit();
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      },
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  get recipes(): FormArray {
    return this.form.get('recipes') as FormArray;
  }

  addRecipe(): void {
    this.recipes.push(
      this.fb.group({
        ingredientId: [null, Validators.required],
        quantityRequired: [null, [Validators.required, Validators.min(0.01)]],
      }),
    );
  }

  removeRecipe(index: number): void {
    this.recipes.removeAt(index);
  }
}
