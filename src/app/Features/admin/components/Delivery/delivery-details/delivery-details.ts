import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DeliveryService } from '../../../../../Core/Services/Delivery-Service/delivery-service';
import { Delivery } from '../../../../../Core/Models/DeliveryModels/delivery';

@Component({
  selector: 'app-delivery-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(
    private route: ActivatedRoute,
    private service: DeliveryService,
    private router: Router
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

    // Validation لو هنروح Delivered
    if (next === 'Delivered') {
      const cash = this.updateModel.cashCollected ?? 0;
      if (cash < this.delivery.order.totalAmount) {
        this.cashError = `Min amount is EGP ${this.delivery.order.totalAmount}`;
        return;
      }
    }

    this.cashError = '';

    const body = {
      status: next,
      cashCollected: next === 'Delivered' ? this.updateModel.cashCollected : undefined
    };

    this.service.updateStatus(this.delivery.id, body).subscribe({
      next: (res) => {
        this.delivery = res;
        this.updateModel.cashCollected = undefined;
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/deliveries']);
  }
}
