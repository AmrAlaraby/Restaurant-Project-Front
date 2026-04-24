import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-track-driver-card',
  imports: [],
  templateUrl: './track-driver-card.html',
  styleUrl: './track-driver-card.scss',
})
export class TrackDriverCard {
  driverName  = input<string | null>(null);
  driverPhone = input<string | null>(null);
  call        = output<void>();
  message     = output<void>();
}
 

