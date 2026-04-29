import { CategoryService } from '../../../../../Core/Services/Categories-Service/categories-service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { CategoryInterface } from '../../../../../Core/Models/MenuItemModels/category-interface';
import { MenuItemsService } from '../../../../../Core/Services/Menu-Item-Service/menu-item-service';

import { IngredientInterface } from '../../../../../Core/Models/MenuItemModels/ingredient-interface';
import { IngredientsService } from '../../../../../Core/Services/Ingredients-Service/ingredients-Service';
import { UpdateMenuItemInterface } from '../../../../../Core/Models/MenuItemModels/update-menu-item-interface';
import { CreateMenuItemInterface } from '../../../../../Core/Models/MenuItemModels/create-menu-item-interface';
import { ImageUpload } from '../image-upload/image-upload';
import { ToastService } from '../../../../../Core/Services/Toast-Service/toast-service';
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
    private categoriesService: CategoryService,
    private ingredientService: IngredientsService,
    private toast: ToastService
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
      arabicName: ['', [Validators.required, Validators.maxLength(150)]],
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
       error: () => this.toast.error('Failed to load categories')
    });
  }

  loadIngredients(): void {
    this.ingredientService.getAll(1, 1000).subscribe({
      next: (response) => {
        this.ingredients = response.data;
      },
      error: () => this.toast.error('Failed to load ingredients')
    });
  }

  loadMenuItem(): void {
    if (!this.menuItemId) return;

    this.loading = true;

    this.menuItemsService.getById(this.menuItemId).subscribe({
      next: (menuItem) => {
        this.form.patchValue({
          name: menuItem.name,
          arabicName: menuItem.arabicName,
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
        this.toast.error('Failed to load menu item');
        this.loading = false;
      },
    });
  }

  onImageSelected(file: File): void {
    this.selectedImageFile = file;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Please fill in all required fields correctly.');
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
           this.toast.success('Menu item updated successfully!');
          this.formSubmitted.emit();
        },
        error: (error) => {
          console.error(error);
          this.loading = false;
          this.toast.error('Failed to update menu item');
        },
      });

      return;
    }

    if (!this.selectedImageFile) {
       this.toast.error('Image is required.');
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
        this.toast.success('Menu item created successfully!');
        this.formSubmitted.emit();
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        this.toast.error('Failed to create menu item');
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
