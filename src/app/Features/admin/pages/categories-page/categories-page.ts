import { Component, OnInit } from '@angular/core';
import { Category } from '../../../../Core/Models/CategoryModels/Category ';
import { CategoryService } from '../../../../Core/Services/Categories-Service/categories-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories-page',
  imports: [CommonModule],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.scss',
})
export class CategoriesPage implements OnInit {
  categories: Category[] = [];
  loading = false;
  error: string | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // 🔥 GET ALL FROM API
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

  // 🔥 بدل items و activeItems هنستخدم MenuItemsCount
  getItemsCount(category: Category): number {
    return category.menuItemsCount;
  }

  // لو عايز تفضل فكرة اللون (optional)
  getActiveClass(category: Category): string {
    const count = category.menuItemsCount;

    if (count >= 10) return 'active-green';
    if (count >= 5) return 'active-blue';
    return 'active-orange';
  }

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

  // EDIT
  onEdit(category: Category): void {
    console.log('Edit category:', category);
  }

  // ADD
  onAddCategory(): void {
    console.log('Add new category');
  }

  // DELETE
  onDelete(id: number): void {
    if (!confirm('Are you sure?')) return;

    this.categoryService.delete(id).subscribe({
      next: () => {
        this.loadCategories(); // refresh
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
