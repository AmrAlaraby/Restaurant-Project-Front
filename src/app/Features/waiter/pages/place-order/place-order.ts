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
import { TableInterface } from '../../../../Core/Models/TableModels/table-interface';
import { UserInterface } from '../../../../Core/Models/AuthModels/user-interface';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { TableService } from '../../../../Core/Services/Table-Service/table-service';
import { CreateOrderInterface } from '../../../../Core/Models/OrderModels/create-order-interface';
import { ActivatedRoute } from '@angular/router';

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
  paymentMethod: string = 'Cash';

  pageIndex = 1;
  pageSize = 8;
  totalCount = 0;

  tables: TableInterface[] = [];
  selectedTableId?: number;

  currentUser!: UserInterface;

  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private menuService: MenuItemsService,
    private orderService: OrdersService,
    private tableService: TableService,
    private authService: AuthService
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

   createOrder(): void {

    if (!this.selectedTableId || this.orderItems.length === 0) return;

    const payload: CreateOrderInterface = {
      customerId: this.currentUser.id,
      branchId: this.currentUser.branchId || 1,
      orderType: 'DineIn',
      tableId: this.selectedTableId,
      paymentMethod: this.paymentMethod,
      items: this.orderItems
    };

    this.isLoading = true;

    this.orderService.createOrder(payload).subscribe({
      next: () => {
        this.orderItems = [];
        this.selectedTableId = undefined;
        this.paymentMethod = 'Cash';
        this.isLoading = false;
        this.loadTables();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

}
