import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DeliveryService } from '../../../../Core/Services/Delivery-Service/delivery-service';

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

  constructor(
    private deliveryService: DeliveryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOwnDeliveries();
  }

  loadOwnDeliveries() {
    this.loading = true;

    this.deliveryService.getOwnAssignedDeliveries().subscribe({
      next: (res) => {
        this.deliveries = res.filter((d: any) => d.deliveryStatus !== 'Delivered');
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  openDetails(id: number) {
    this.router.navigate(['/driver/deliveries', id]);
  }
}
