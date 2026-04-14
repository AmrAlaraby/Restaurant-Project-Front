import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableInterface } from '../../../../../Core/Models/TableModels/table-interface';

@Component({
  selector: 'app-table-selector',
  imports: [],
  templateUrl: './table-selector.html',
  styleUrl: './table-selector.scss',
})
export class TableSelector {
  @Input() tables: TableInterface[] = [];

  @Input() tableId?: number;
  @Output() tableIdChange = new EventEmitter<number>();

  selectTable(id: number): void {
    this.tableIdChange.emit(id);
  }
}
