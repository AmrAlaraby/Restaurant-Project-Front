import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { CategoryService } from '../../../../Core/Services/Categories-Service/categories-service';
import { Category } from '../../../../Core/Models/CategoryModels/Category ';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
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

  selectedCategoryId: number | null = null;
  showDeleteModal = false;

  selectedCategory: Category | null = null;
  showEditModal = false;
  editForm!: FormGroup;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private localizationService: LocalizationService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
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

  // ✅ INIT FORM (FIX)
  private initForm(): void {
    this.addForm = this.fb.group({
      name: [''],
      arabicName: ['']
    });

    this.editForm = this.fb.group({
      name: [''],
      arabicName: ['']
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
  // getCategoryIcon(name: string): string {
  //   switch (name.toLowerCase()) {
  //     case 'pizza':
  //       return '🍕';
  //     case 'grill':
  //       return '🥩';
  //     case 'salads':
  //       return '🥗';
  //     default:
  //       return '🍽️';
  //   }
  // }

  // CLASS
  getActiveClass(category: Category): string {
    const count = category.menuItemsCount;

    if (count >= 10) return 'active-green';
    if (count >= 5) return 'active-blue';
    return 'active-orange';
  }

  // EDIT
  onEdit(category: Category): void {
    console.log(category)

    this.selectedCategory = category;
    this.editForm.patchValue({ name: category.name });
    this.editForm.patchValue({ Arabicname: category.arabicName });
    this.showEditModal = true;
    document.body.style.overflow = 'hidden';
  }

  submitEdit(): void {
    
    if (this.editForm.invalid || !this.selectedCategory) return;

    this.categoryService.update(this.selectedCategory.id, this.editForm.value).subscribe({
      next: () => {
        this.successMessage = 'Category updated successfully ✔';
        this.errorMessage = null;
        this.loadCategories();
        this.closeEditModal();
        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to update category ❌';
      },
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedCategory = null;
    this.editForm.reset();
    document.body.style.overflow = '';
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
    this.selectedCategoryId = id;
    this.showDeleteModal = true;
    document.body.style.overflow = 'hidden';
  }

  confirmDelete(): void {
    if (!this.selectedCategoryId) return;

    this.categoryService.delete(this.selectedCategoryId).subscribe({
      next: () => {
        this.successMessage = 'Category deleted successfully ✔';
        this.loadCategories();
        this.closeDeleteModal();
        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to delete category ❌';
        this.closeDeleteModal();
      },
    });
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedCategoryId = null;
    document.body.style.overflow = '';
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

  getCategoryName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.arabicName || item.name;
    }
    return item.name;
  }
}
