import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { CategoryService } from '../../../../Core/Services/Categories-Service/categories-service';
import { Category } from '../../../../Core/Models/CategoryModels/Category ';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CategoriesPage implements OnInit {
  categories: Category[] = [];
  loading = false;
  error: string | null = null;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  showAddModal = false;
  addForm!: FormGroup;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  // ✅ INIT FORM (FIX)
  private initForm(): void {
    this.addForm = this.fb.group({
      name: [''],
    });
  }

  // 🔥 GET ALL
  loadCategories(): void {
    this.loading = true;

    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categories = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load categories';
        this.loading = false;
      },
    });
  }

  // ICON
  getCategoryIcon(name: string): string {
    switch (name.toLowerCase()) {
      case 'pizza':
        return '🍕';
      case 'grill':
        return '🥩';
      case 'salads':
        return '🥗';
      default:
        return '🍽️';
    }
  }

  // CLASS
  getActiveClass(category: Category): string {
    const count = category.menuItemsCount;

    if (count >= 10) return 'active-green';
    if (count >= 5) return 'active-blue';
    return 'active-orange';
  }

  // EDIT
  onEdit(category: Category): void {
    const updated = {
      name: category.name + ' Updated',
    };

    this.categoryService.update(category.id, updated).subscribe({
      next: () => {
        this.successMessage = 'Category updated successfully ✔';
        this.errorMessage = null;
        this.loadCategories();

        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to update category ❌';
      },
    });
  }

  // ADD
  submitAdd(): void {
    if (this.addForm.invalid) return;

    this.categoryService.create(this.addForm.value).subscribe({
      next: () => {
        this.successMessage = 'Category added successfully ✔';
        this.loadCategories();
        this.closeAddModal();

        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to add category ❌';
      },
    });
  }

  // DELETE
  onDelete(id: number): void {
    if (!confirm('Are you sure you want to delete this category?')) return;

    this.categoryService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Category deleted successfully ✔';
        this.loadCategories();

        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to delete category ❌';
      },
    });
  }

  // MODAL
  openAddModal(): void {
    this.showAddModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeAddModal(): void {
    this.showAddModal = false;
    document.body.style.overflow = '';
  }
}
