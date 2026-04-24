import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-track-delivery-header',
  imports: [],
  templateUrl: './track-delivery-header.html',
  styleUrl: './track-delivery-header.scss',
})
export class TrackDeliveryHeader {

 orderId   = input.required<number>();
  branchName = input<string | null>(null);
  back      = output<void>();
}
