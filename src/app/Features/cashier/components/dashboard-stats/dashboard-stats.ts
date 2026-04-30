import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStat } from '../../pages/cashier-dashboard/cashier-dashboard';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-stats',
  imports: [CommonModule,TranslatePipe],
  templateUrl: './dashboard-stats.html',
  styleUrl: './dashboard-stats.scss',
})
export class DashboardStatsComponent {
  @Input() stats: DashboardStat[] = [];
}