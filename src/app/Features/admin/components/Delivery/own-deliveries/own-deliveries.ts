import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryService } from '../../../../../Core/Services/Delivery-Service/delivery-service';
import { ToastService } from '../../../../../Core/Services/Toast-Service/toast-service';

@Component({
  selector: 'app-own-deliveries',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './own-deliveries.html',
  styleUrls: ['./own-deliveries.scss'],
})
export class OwnDeliveries implements OnInit {
  deliveries: any[] = [];
  loading = false;

  constructor(private deliveryService: DeliveryService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadOwnDeliveries();
  }

  loadOwnDeliveries() {
    this.loading = true;

    this.deliveryService.getOwnAssignedDeliveries().subscribe({
      next: (res) => {
        this.deliveries = res;
        this.loading = false;
      },
      error: (err) => {
         this.toast.error('Failed to load own deliveries');
        console.error(err);
        this.loading = false;
       
      },
    });
  }
}
