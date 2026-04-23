import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchStockInterface } from '../../../../../Core/Models/BranchStockModels/BranchStockInterface';

@Component({
  selector: 'app-chef-available-stock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chef-available-stock.html',
  styleUrl: './chef-available-stock.scss'
})
export class ChefAvailableStockComponent {

  @Input() stocks: BranchStockInterface[] = [];

  getBarPercent(item: BranchStockInterface): number {
    if (!item.lowThreshold || item.lowThreshold === 0) return 100;
    const full = item.lowThreshold * 3;
    return Math.min((item.quantityAvailable / full) * 100, 100);
  }

  getBarColor(item: BranchStockInterface): string {
    const pct = this.getBarPercent(item);
    if (pct <= 33) return '#C41E1E';
    if (pct <= 60) return '#F5A623';
    return '#2E9E5B';
  }
}
