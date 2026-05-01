import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() toggle = new EventEmitter<number>();
  @Output() openOrder = new EventEmitter<number>();
  @Output() tableClick = new EventEmitter<TableInterface>();
  @Input() isHome: boolean = false;
  
  constructor(private router: Router) {}

  onToggle(tableId: number) {
    this.toggle.emit(tableId);
  }

  onOpenOrder(tableId: number) {
    this.openOrder.emit(tableId);
  }
}