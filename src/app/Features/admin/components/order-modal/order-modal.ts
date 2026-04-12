import { Component, EventEmitter, Input, OnInit, Output, computed, signal } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MenuItemsService } from '../../../../Core/Services/Menu-Item-Service/menu-item-service';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';
import { TableService } from '../../../../Core/Services/Table-Service/table-service';
import { CreateOrderInterface } from '../../../../Core/Models/OrderModels/create-order-interface';
import { BranchDto } from '../../../../Core/Models/BranchModels/Branch-dto';

@Component({
  selector: 'app-order-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './order-modal.html',
  styleUrl: './order-modal.scss',
})
export class OrderModal implements OnInit {
  @Input() branches : BranchDto[] = [];
  @Output() close = new EventEmitter();

  form!: FormGroup;

  tables = signal<any[]>([]);
  menuItems = signal<any[]>([]);
  error:string|null =null;


  constructor(
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private tableService: TableService,
    private menuService: MenuItemsService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadMenu();
    this.addItem();

    this.form.valueChanges.subscribe(() => {
    this.calculateTotal();
  });
  }

total = 0;

calculateTotal() {
  this.total = this.items.controls.reduce((sum: number, item: any) => {
    return sum + (item.value.quantity * item.value.unitPrice);
  }, 0);
}

  initForm() {
    this.form = this.fb.group({
      branchId: ['', Validators.required],
      orderType: ['', Validators.required],
      tableId: [],
      customerId: ['', Validators.required],
      paymentMethod: ['Cash', Validators.required],

      deliveryAddress: this.fb.group({
        buildingNumber: [],
        street: [],
        city: [],
        note: [],
        specialMark: []
      }),

      items: this.fb.array([])
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem() {
    this.items.push(this.fb.group({
      menuItemId: ['', Validators.required],
      quantity: [1, Validators.required],
      unitPrice: [0]
    }));
  }

  removeItem(i: number) {
    this.items.removeAt(i);
  }

onMenuChange(i: number) {

  console.log('🔄 MENU CHANGED INDEX:', i);

  const itemId = this.items.at(i).value.menuItemId;

  const selected = this.menuItems().find(m => m.id == itemId);

  console.log('🎯 SELECTED ITEM:', selected);

  if (selected) {
    this.items.at(i).patchValue({
      unitPrice: selected.price
    });
  }
}

  onTypeChange() {
    const type = this.form.value.orderType;

    if (type === 'DineIn') {
      this.loadTables();
    }
  }

  loadTables() {
    const branchId = this.form.value.branchId;

    this.tableService.getAllTables(branchId, false)
      .subscribe(res => this.tables.set(res));
  }

  loadMenu() {
    this.menuService.getAll({ pageIndex: 1, pageSize: 1000 })
      .subscribe(res => this.menuItems.set(res.data));
  }

  submit() {

  console.log('🔥 FORM VALUE:', this.form.value);

  if (this.form.invalid) {
    console.log('❌ FORM INVALID');
    this.form.markAllAsTouched();
    this.error = 'Please fill in all required fields and ensure the form is valid.';
    return;
  }

  const raw = this.form.value;

  const dto: CreateOrderInterface = {
    customerId: raw.customerId,
    branchId: raw.branchId,
    orderType: raw.orderType,
    paymentMethod: raw.paymentMethod,
    items: raw.items,
    tableId: raw.tableId
  };

  // 🧠 include address ONLY if Delivery
  if (raw.orderType === 'Delivery') {
    dto.deliveryAddress = raw.deliveryAddress;
  }

  console.log('🚀 DTO SENT:', dto);

  this.ordersService.createOrder(dto)
    .subscribe({
      next: (res) => {
        console.log('✅ ORDER CREATED:', res);
        this.close.emit();
        this.error = null;
      },
      error: (err) => {
        console.error('❌ API ERROR:', err);
        this.error = err.error || 'An error occurred while creating the order.';
      }
    });
}
}