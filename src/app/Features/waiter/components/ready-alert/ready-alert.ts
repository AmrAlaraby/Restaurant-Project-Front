import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ready-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ready-alert.html',
  styleUrl: './ready-alert.scss',
})
export class ReadyAlertComponent {
  @Input()  readyOrders: any[] = [];
  @Output() viewKitchen = new EventEmitter<void>();

  getReadyOrdersSummary(): string {
    return this.readyOrders
      .map(o => `Order #${o.id} (Table ${o.tableNumber})`)
      .join(' and ') + ' are ready from kitchen';
  }
}