import { MenuItemsStatsInterface } from '../../../../Core/Models/MenuItemModels/menu-items-stats-interface';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-menu-items-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-items-stats.html',
  styleUrl: './menu-items-stats.scss',
})
export class MenuItemsStats {
  @Input({ required: true })
  stats!: MenuItemsStatsInterface;
}
