import { Component } from '@angular/core';
import { TableSelector } from "../../components/place-order/table-selector/table-selector";
import { CategoryFilter } from "../../components/place-order/category-filter/category-filter";
import { MenuList } from "../../components/place-order/menu-list/menu-list";
import { OrderSummary } from "../../components/place-order/order-summary/order-summary";
import { PaymentSelector } from "../../components/place-order/payment-selector/payment-selector";
import { Category } from '../../../../Core/Models/CategoryModels/Category ';
import { CategoryService } from '../../../../Core/Services/Categories-Service/categories-service';
import { MenuItemInterface } from '../../../../Core/Models/MenuItemModels/menu-item-interface';
import { MenuItemsService } from '../../../../Core/Services/Menu-Item-Service/menu-item-service';

@Component({
  selector: 'app-place-order',
  imports: [TableSelector, CategoryFilter, MenuList, OrderSummary, PaymentSelector],
  templateUrl: './place-order.html',
  styleUrl: './place-order.scss',
})
export class PlaceOrder {

  categories: Category[] = [];
  selectedCategoryId?: number;

  menuItems: MenuItemInterface[] = [];

  pageIndex = 1;
  pageSize = 8;
  totalCount = 0;

  constructor(
    private categoryService: CategoryService,
    private menuService: MenuItemsService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categories = res;
        this.loadMenuItems();
      }
    });
  }

  onCategoryChange(categoryId?: number): void {
    this.selectedCategoryId = categoryId;

    this.pageIndex = 1;
    this.loadMenuItems();
  }

  loadMenuItems(): void {
    this.menuService.getAll({
      categoryId: this.selectedCategoryId,
      isAvailable: true,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }).subscribe({
      next: (res) => {
        this.menuItems = res.data;
        this.totalCount = res.count;
      }
    });
  }
  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadMenuItems();
  }
}
