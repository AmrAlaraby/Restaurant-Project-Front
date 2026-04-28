import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllDeliveries } from '../../../components/Delivery/all-deliveries/all-deliveries';
import { AssignDelivery } from '../../../components/Delivery/assign-delivery/assign-delivery';
import { OwnDeliveries } from '../../../components/Delivery/own-deliveries/own-deliveries';
import { DeliveryService } from '../../../../../Core/Services/Delivery-Service/delivery-service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-delivery-page',
  standalone: true,
  imports: [CommonModule, AllDeliveries, AssignDelivery, OwnDeliveries, TranslatePipe],
  templateUrl: './delivery-page.html',
  styleUrls: ['./delivery-page.scss'],
})
export class DeliveryPage implements OnInit {
  activeTab: 'all' | 'assign' | 'own' = 'all';

  totalOrders = 0;
  onTheWay = 0;
  pickedUp = 0;
  delivered = 0;

  constructor(private deliveryService: DeliveryService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.deliveryService.getAll(1, 100).subscribe({
      next: (res) => {
        this.totalOrders = res.count;
        this.onTheWay  = res.data.filter((d: any) => d.deliveryStatus === 'OnTheWay').length;
        this.pickedUp  = res.data.filter((d: any) => d.deliveryStatus === 'PickedUp').length;
        this.delivered = res.data.filter((d: any) => d.deliveryStatus === 'Delivered').length;
      }
    });
  }

  setTab(tab: 'all' | 'assign' | 'own') {
    this.activeTab = tab;
  }
}
