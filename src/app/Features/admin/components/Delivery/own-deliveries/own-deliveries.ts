import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryService } from '../../../../../Core/Services/Delivery-Service/delivery-service';

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

  constructor(private deliveryService: DeliveryService) {}

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
        console.error(err);
        this.loading = false;
      },
    });
  }
}
