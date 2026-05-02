import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MenuItemsStatsInterface } from '../../../../../Core/Models/MenuItemModels/menu-items-stats-interface';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-menu-items-stats',
  standalone: true,
  imports: [CommonModule, TranslatePipe
  ],
  templateUrl: './menu-items-stats.html',
  styleUrl: './menu-items-stats.scss',
})
export class MenuItemsStats {
  @Input({ required: true })
  stats: MenuItemsStatsInterface = {
    totalItems: 0,
    availableItems: 0,
    unavailableItems: 0
  };
}
