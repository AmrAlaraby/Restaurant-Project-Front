import { SignalRService } from './../../../../Core/Services/SignalR-Service/SignalrService';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DeliveryService } from '../../../../Core/Services/Delivery-Service/delivery-service';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { Delivery } from '../../../../Core/Models/DeliveryModels/delivery';

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
    private router: Router,
    private authService: AuthService,
    private SignalRService:SignalRService 
  ) {}

  ngOnInit(): void {
    this.loadOwnDeliveries();
    this.listenToUpdates();
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

    listenToUpdates(): void {
      let token = this.authService.getAccessToken();
      this.SignalRService.startRestaurantUpdatesConnection(token??"");
      this.SignalRService.onRestaurantUpdate("OrderAssignedToDriver",(data :Delivery | null) => {
      this.deliveries.unshift(data);
    });
  }

  openDetails(id: number) {
    this.router.navigate(['/driver/deliveries', id]);
  }
}
