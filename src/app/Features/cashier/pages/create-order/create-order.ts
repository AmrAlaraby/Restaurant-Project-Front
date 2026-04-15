import { OrderTable } from './../../../admin/components/Order/order-table/order-table';
import { Component } from '@angular/core';
import { CategoryFilter } from '../../../waiter/components/place-order/category-filter/category-filter';
import { MenuList } from '../../../waiter/components/place-order/menu-list/menu-list';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { CategoryService } from '../../../../Core/Services/Categories-Service/categories-service';
import { MenuItemsService } from '../../../../Core/Services/Menu-Item-Service/menu-item-service';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';
import { TableService } from '../../../../Core/Services/Table-Service/table-service';
import { UserInterface } from '../../../../Core/Models/AuthModels/user-interface';
import { Category } from '../../../../Core/Models/CategoryModels/Category ';
import { MenuItemInterface } from '../../../../Core/Models/MenuItemModels/menu-item-interface';
import { CreateOrderItemInterface } from '../../../../Core/Models/OrderModels/create-order-item-interface';
import { TableInterface } from '../../../../Core/Models/TableModels/table-interface';
import { ActivatedRoute } from '@angular/router';
import { OrderType } from '../../../../Core/Models/OrderModels/waiter-order.model';
import { OrderSummary } from "../../../waiter/components/place-order/order-summary/order-summary";
import { TableSelector } from "../../../waiter/components/place-order/table-selector/table-selector";
import { OrderTypeSelector } from "../../components/create-order/order-type-selector/order-type-selector";
import { CommonModule } from '@angular/common';
import { CustomerSearch } from "../../components/create-order/customer-search/customer-search";
import { CustomerInterface } from '../../../../Core/Models/UserModels/customer-interface';

@Component({
  selector: 'app-create-order',
  imports: [CategoryFilter, MenuList, OrderSummary, TableSelector, OrderTypeSelector, CommonModule, CustomerSearch],
  templateUrl: './create-order.html',
  styleUrl: './create-order.scss',
})
export class CreateOrder {
  categories: Category[] = [];
  selectedCategoryId?: number;

  menuItems: MenuItemInterface[] = [];

  orderItems: CreateOrderItemInterface[] = [];
  paymentMethod: string = 'Cash';

  pageIndex = 1;
  pageSize = 8;
  totalCount = 0;

  tables: TableInterface[] = [];
  selectedTableId?: number;

  currentUser!: UserInterface;

  orderType: OrderType = 'DineIn';

  selectedCustomer?: CustomerInterface;

  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private menuService: MenuItemsService,
    private orderService: OrdersService,
    private tableService: TableService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadUserAndThenTables();
    this.loadMenuItems();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categories = res;
        this.loadMenuItems();
      }
    });
  }

loadUserAndThenTables(): void {
  this.authService.getCurrentUser().subscribe(user => {
    this.currentUser = user;

    this.loadTables();
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

  loadTables(): void {
    this.tableService.getTables({
      pageIndex: 1,
      pageSize: 50,
      isOccupied: false,
      branchId: this.currentUser.branchId 
    }).subscribe(res => {
      this.tables = res.data;

      this.handleRouteTableSelection();
    });
  }
   handleRouteTableSelection(): void {
    const tableNumber = this.route.snapshot.paramMap.get('tableNumber');

    if (!tableNumber) return;

    const matchedTable = this.tables.find(
      t => t.id === Number(tableNumber)
    );

    if (matchedTable) {
      this.selectedTableId = matchedTable.id;
    }
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

  onCustomerSelected(user: CustomerInterface) {
  this.selectedCustomer = user;
}
}
