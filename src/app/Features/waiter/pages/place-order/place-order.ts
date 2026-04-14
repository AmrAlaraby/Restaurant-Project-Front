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
import { CreateOrderItemInterface } from '../../../../Core/Models/OrderModels/create-order-item-interface';

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

  orderItems: CreateOrderItemInterface[] = [];

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
  // =========================
  // ADD ITEM
  // =========================
  addToOrder(item: MenuItemInterface): void {

  const existing = this.orderItems.find(x => x.menuItemId === item.id);

  if (existing) {
    existing.quantity++;
    return;
  }

  this.orderItems.push({
    menuItemId: item.id,
    quantity: 1,
    unitPrice: item.price,

    
    name: item.name,
    imageUrl: item.imageUrl
  } as any);
}

  // =========================
  // REMOVE ITEM
  // =========================
  removeItem(menuItemId: number): void {
    this.orderItems = this.orderItems.filter(x => x.menuItemId !== menuItemId);
  }

  // =========================
  // DECREASE QUANTITY
  // =========================
  decreaseQty(menuItemId: number): void {
    const item = this.orderItems.find(x => x.menuItemId === menuItemId);

    if (!item) return;

    item.quantity--;

    if (item.quantity <= 0) {
      this.removeItem(menuItemId);
    }
  }

  // =========================
  // TOTAL
  // =========================
  get total(): number {
    return this.orderItems.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);
  }

}
