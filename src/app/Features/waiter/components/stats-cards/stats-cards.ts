import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-cards.html',
  styleUrl: './stats-cards.scss',
})
export class StatsCardsComponent {
  @Input() tablesServed   = 0;
  @Input() activeOrders   = 0;
  @Input() occupiedTables = 0;
  @Input() myOrdersTotal  = 0;
}