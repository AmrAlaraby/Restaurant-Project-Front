import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableInterface } from '../../../../../Core/Models/TableModels/table-interface';

@Component({
  selector: 'app-waiter-table-list',
  standalone: true,
  templateUrl: './waiter-table-list.html',
  styleUrl: './waiter-table-list.scss',
})
export class WaiterTableList {

  @Input() table!: TableInterface;

  @Output() toggle = new EventEmitter<number>();
  @Output() openOrder = new EventEmitter<number>();

  onToggle() {
    this.toggle.emit(this.table.id);
  }

  onOpenOrder(id: number) {
    this.openOrder.emit(id);
  }
}