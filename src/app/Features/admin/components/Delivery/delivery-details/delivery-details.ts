import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DeliveryService } from '../../../../../Core/Services/Delivery-Service/delivery-service';
import { Delivery } from '../../../../../Core/Models/DeliveryModels/delivery';
import { TranslatePipe } from '@ngx-translate/core';
import { ToastService } from '../../../../../Core/Services/Toast-Service/toast-service';
import { OrdersService } from '../../../../../Core/Services/Orders-Service/orders-service';

@Component({
  selector: 'app-delivery-details',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './delivery-details.html',
  styleUrls: ['./delivery-details.scss']
})
export class DeliveryDetails {

  delivery?: Delivery;
  loading = false;


  updateModel = {
    cashCollected: undefined as number | undefined
  };

  cashError = '';

  private statusFlow: Record<string, string> = {
    'Assigned': 'PickedUp',
    'PickedUp': 'OnTheWay',
    'OnTheWay': 'Delivered',
  };

  steps = ['Assigned', 'Picked Up', 'On the Way', 'Delivered'];

  private statusToIndex: Record<string, number> = {
    'Assigned': 0,
    'PickedUp': 1,
    'OnTheWay': 2,
    'Delivered': 3,
  };

  get currentStepIndex(): number {
    return this.delivery ? (this.statusToIndex[this.delivery.deliveryStatus] ?? 0) : 0;
  }

  getStepClass(i: number): string {
    if (i < this.currentStepIndex) return 'done';
    if (i === this.currentStepIndex) return 'active';
    return 'inactive';
  }

  getStepIcon(i: number): string {
    if (i < this.currentStepIndex) return '✓';
    if (i === this.currentStepIndex) return '●';
    return '○';
  }

  constructor(
    private route: ActivatedRoute,
    private service: DeliveryService,
    private ordersService: OrdersService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.load(id);
  }

  load(id: number) {
    this.loading = true;

    this.service.getById(id).subscribe({
      next: (res) => {
        this.delivery = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.error('Failed to load delivery details');
      }
    });
  }

  nextStatus(): string | null {
    return this.delivery ? (this.statusFlow[this.delivery.deliveryStatus] ?? null) : null;
  }

 updateStatus() {
  if (!this.delivery) return;

  const next = this.nextStatus();
  if (!next) return;

  if (next === 'Delivered') {
    const cash = this.updateModel.cashCollected ?? 0;
    if (cash < this.delivery.order.totalAmount) {
      this.toast.error(`Min amount is EGP ${this.delivery.order.totalAmount}`);
      this.cashError = `Min amount is EGP ${this.delivery.order.totalAmount}`;
      return;
    }
  }

  this.cashError = '';

  const body: any = { status: next };
  if (next === 'Delivered') {
    body.cashCollected = this.updateModel.cashCollected;
  }

  this.service.updateStatus(this.delivery.id, body).subscribe({
    next: (res) => {
      this.delivery = res;
      this.updateModel.cashCollected = undefined;
      this.toast.success(`Status updated to ${next}`);

      if (next === 'Delivered') {
        this.ordersService.markAsPaid(res.order.id).subscribe({
          next: () => this.toast.success('Order marked as paid'),
          error: (err) => {
            const message = err.error?.detail || 'Failed to mark order as paid';
            this.toast.error(message);
          }
        });
      }
    },
    error: (err) => {
      const message = err.error?.detail || 'Failed to update status';
      this.toast.error(message);
    }
  });
}

  goBack() {
    this.router.navigate(['/admin/deliveries']);
  }
}
