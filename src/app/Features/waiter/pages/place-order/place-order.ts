import { Component } from '@angular/core';
import { TableSelector } from "../../components/place-order/table-selector/table-selector";
import { CategoryFilter } from "../../components/place-order/category-filter/category-filter";
import { MenuList } from "../../components/place-order/menu-list/menu-list";
import { OrderSummary } from "../../components/place-order/order-summary/order-summary";
import { PaymentSelector } from "../../components/place-order/payment-selector/payment-selector";
import { Category } from '../../../../Core/Models/CategoryModels/Category ';
import { CategoryService } from '../../../../Core/Services/Categories-Service/categories-service';

@Component({
  selector: 'app-place-order',
  imports: [TableSelector, CategoryFilter, MenuList, OrderSummary, PaymentSelector],
  templateUrl: './place-order.html',
  styleUrl: './place-order.scss',
})
export class PlaceOrder {

  categories: Category[] = [];
  selectedCategoryId?: number;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categories = res;
      }
    });
  }

  onCategoryChange(categoryId?: number): void {
    this.selectedCategoryId = categoryId;

    // 🔥 هنا هنستخدمه في Commit 4
    this.loadMenuItems();
  }

  loadMenuItems(): void {
    // placeholder for next commit
  }
}
