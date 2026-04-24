import { Component, input } from '@angular/core';

@Component({
  selector: 'app-track-info-grid',
  imports: [],
  templateUrl: './track-info-grid.html',
  styleUrl: './track-info-grid.scss',
})
export class TrackInfoGrid {
address       = input.required<any>();
  items         = input.required<any[]>();
  totalAmount   = input.required<number>();
  cashCollected = input<number | null>(null);
}
