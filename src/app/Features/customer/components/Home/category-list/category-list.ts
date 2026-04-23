import { Component, inject } from '@angular/core';
import { CategoryService } from '../../../../../Core/Services/Categories-Service/categories-service';
import { Router } from '@angular/router';
import { Category } from '../../../../../Core/Models/CategoryModels/Category ';

@Component({
  selector: 'app-category-list',
  imports: [],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList {
private categoryService = inject(CategoryService);
  private router = inject(Router);

  categories: Category[] = [];

  ngOnInit() {
    this.categoryService.getAll().subscribe(res => {
      this.categories = res;
    });
  }

  goToCategory(categoryId: number) {
    this.router.navigate(['/customer/browse-menu'], {
      queryParams: { categoryId }
    });
  }

  getIcon(name: string): string {
  const map: any = {
    burgers: '🍔',
    pizza: '🍕',
    drinks: '🥤',
    desserts: '🧁',
    grills: '🍖',
    salads: '🥗'
  };

  return map[name.toLowerCase()] || '🍽️';
}
}
