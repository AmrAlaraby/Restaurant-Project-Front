import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MenuItemsService } from '../../../../../Core/Services/Menu-Item-Service/menu-item-service';
import { OrdersService } from '../../../../../Core/Services/Orders-Service/orders-service';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';


@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,TranslatePipe],
  templateUrl: './order-details.html',
  styleUrl: './order-details.scss',
})
export class OrderDetails implements OnInit {

  @Input() orderId!: number | null;
  @Output() close = new EventEmitter();

  order: any;
  menuItems: any[] = [];

  form!: FormGroup;
  error:string|null =null;

  CurrentLanguage: string = 'en';

  constructor(
    private ordersService: OrdersService,
    private menuService: MenuItemsService,
    private fb: FormBuilder,
    private localizationService:LocalizationService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadMenu();
    this.loadOrder();
    this.getCurrentLanguage();
  }

  getCurrentLanguage(): void {
    this.CurrentLanguage = this.localizationService.getCurrentLang();
    this.localizationService.currentLang$
    .subscribe(lang => {
      this.CurrentLanguage = lang;
    });
  }

  // =========================
  // FORM INIT
  // =========================
  initForm() {
    this.form = this.fb.group({
      items: this.fb.array([])
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  // =========================
  // LOAD ORDER
  // =========================
  loadOrder() {

    if (!this.orderId) return;

    console.log('📦 Load order:', this.orderId);

    this.ordersService.getOrderById(this.orderId)
      .subscribe({
        next: (res) => {

          console.log('✅ Order loaded:', res);

          this.order = res;

          this.items.clear();
          this.error = null;

        },
        error: (err) => {
          console.error('❌ Load order error:', err);
          this.error = err.error.detail ||'Failed to load order details. Please try again later.';
        }
      });
  }

  // =========================
  // LOAD MENU
  // =========================
  loadMenu() {
    this.menuService.getAll({ pageIndex: 1, pageSize: 1000 })
      .subscribe(res => {
        this.menuItems = res.data;
      });
  }

  // =========================
  // AVAILABLE ITEMS (NO DUPLICATES)
  // =========================
  get availableMenuItems() {

    const existingIds =
      this.order?.orderItems?.map((x: any) => x.menuItemId) || [];

    return this.menuItems.filter(m => !existingIds.includes(m.id));
  }

  // =========================
  // ADD ITEM ROW
  // =========================
  addItem() {
    this.items.push(this.fb.group({
      menuItemId: null,
      quantity: 1,
      unitPrice: 0
    }));
  }

  // =========================
  // MENU CHANGE
  // =========================
  onMenuChange(i: number) {

    const selectedId = this.items.at(i).value.menuItemId;

    const selected = this.menuItems.find(m => m.id == selectedId);

    if (!selected) return;

    this.items.at(i).patchValue({
      unitPrice: selected.price
    });
  }

  // =========================
  // SAVE NEW ITEMS
  // =========================
  saveNewItems() {

    const newItems = this.items.value;

    if (!newItems.length) return;

    console.log('➕ Adding items:', newItems);

    this.ordersService.addItemsToOrder(this.orderId!, newItems)
      .subscribe({
        next: () => {
          console.log('✅ Items added');
          this.loadOrder();
          this.error = null;
        },
        error: (err) => {
          console.error('❌ Add items error:', err);
          this.error = err.error.detail || 'Failed to add items. Please try again.';
        }
      });
  }

  // =========================
  // REMOVE ITEM
  // =========================
  removeItem(orderItemId: number) {

    console.log('🗑 Remove:', orderItemId);

    this.ordersService.removeItemFromOrder(this.orderId!, orderItemId)
      .subscribe({
        next: () => {
          console.log('✅ Removed');
          this.loadOrder();
          this.error = null;
        },
        error: (err) => {
          console.error('❌ Remove error:', err);
          this.error = err.error.detail || 'Failed to remove item. Please try again.';
        }
      });
  }

  // =========================
  // CANCEL ORDER
  // =========================
  cancelOrder() {

    console.log('🚨 Cancel order');

    this.ordersService.cancelOrder(this.orderId!)
      .subscribe({
        next: () => {
          console.log('✅ Cancelled');
          this.loadOrder();
          this.error = null;
        },
        error: (err) => {
          console.error('❌ Cancel error:', err);
          this.error = err.error.detail || 'Failed to cancel order. Please try again.';
        }
      });
  }

  // =========================
  // RULE
  // =========================
  isReceived(): boolean {
    return this.order?.status === 'Received';
  }

  updateStatus(status: string) {
    
  if (!this.orderId) return;

  this.ordersService.updateOrderStatus(this.orderId, status)
    .subscribe({
      next: (res) => {
        console.log('✅ Status updated:', res);

        this.order = res; // تحديث فوري في المودال
        this.error = null;
      },
      error: (err) => {
        console.error('❌ Status update error:', err);
        this.error = err.error.detail || 'Failed to update status';
      }
    });
}
  getMenuItemName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
     return item.arabicName || item.name;
    }
    return item.name;
  }
  getOrdertemName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
     return item.arabicMenuItemName || item.menuItemName;
    }
    return item.menuItemName;
  }
}
