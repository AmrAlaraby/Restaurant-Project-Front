import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchStockInterface } from '../../../../../Core/Models/BranchStockModels/BranchStockInterface';

@Component({
  selector: 'app-chef-low-stock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chef-low-stock.html',
  styleUrl: './chef-low-stock.scss'
})
export class ChefLowStockComponent {

  @Input() stocks: BranchStockInterface[] = [];

  requestSent = false;

  getBarPercent(item: BranchStockInterface): number {
    if (!item.lowThreshold || item.lowThreshold === 0) return 0;
    const full = item.lowThreshold * 3;
    return Math.min((item.quantityAvailable / full) * 100, 100);
  }

  requestRestock(): void {
    this.requestSent = true;
    setTimeout(() => (this.requestSent = false), 3000);
  }
}
