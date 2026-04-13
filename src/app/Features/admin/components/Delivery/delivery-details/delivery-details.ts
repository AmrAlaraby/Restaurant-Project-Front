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

  // 🔥 Update form
updateModel = {
  status: '',
  cashCollected: undefined as number | undefined
};

  statuses: string[] = [
    'Assigned',
    'PickedUp',
    'OnTheWay',
    'Delivered'
  ];

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

        // preload current status
        this.updateModel.status = res.deliveryStatus;

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

 updateStatus() {
  if (!this.delivery) return;

  const body = {
    status: this.updateModel.status,
    cashCollected: this.updateModel.cashCollected ?? undefined
  };

  this.service.updateStatus(this.delivery.id, body)
    .subscribe({
      next: (res) => {
        this.delivery = res;
      }
    });
}

goBack() {
  this.router.navigate(['/admin/deliveries']);
}
}
