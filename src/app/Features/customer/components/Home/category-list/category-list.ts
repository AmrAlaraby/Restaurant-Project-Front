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

  getImage(name: string): string {
    const map: { [key: string]: string } = {
      burgers: '/images/categories/Burger4.jpg',
      pizza: '/images/categories/pizza.jpg',
      drinks: '/images/categories/drinks2.jpg',
      desserts: '/images/categories/dessert2.webp',
      grills: '/images/categories/grills2.jpg',
      salads: '/images/categories/Salad2.jpg',
    };
    return map[name.toLowerCase()] || 'public/images/categories/default.png';
  }
}
