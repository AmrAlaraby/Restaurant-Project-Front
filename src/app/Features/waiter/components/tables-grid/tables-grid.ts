import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableInterface } from '../../../../Core/Models/TableModels/table-interface';
import { Router } from '@angular/router';
import { WaiterTableList } from '../tabble-waiter/waiter-table-list/waiter-table-list';


@Component({
  selector: 'app-tables-grid',
  standalone: true,
  imports: [CommonModule, WaiterTableList],
  templateUrl: './tables-grid.html',
  styleUrl: './tables-grid.scss',
})
export class TablesGridComponent {
  @Input() tables: TableInterface[] = [];

  constructor(private router: Router) {}

  onToggle(tableId: number) {
    // لو عندك table service بيعمل toggle استخدميه هنا
    console.log('Toggle table:', tableId);
  }

  onOpenOrder(tableId: number) {
    this.router.navigate(['/waiter/tables', tableId]);
  }
}