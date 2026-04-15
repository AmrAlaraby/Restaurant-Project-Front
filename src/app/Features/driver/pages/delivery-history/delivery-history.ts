import { Component } from '@angular/core';
import { OwnDeliveries } from "../../../admin/components/Delivery/own-deliveries/own-deliveries";

@Component({
  selector: 'app-delivery-history',
  imports: [OwnDeliveries],
  templateUrl: './delivery-history.html',
  styleUrl: './delivery-history.scss',
})
export class DeliveryHistory {

}
