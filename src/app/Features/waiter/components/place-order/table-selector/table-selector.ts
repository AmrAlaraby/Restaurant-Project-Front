import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableInterface } from '../../../../../Core/Models/TableModels/table-interface';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-table-selector',
  imports: [TranslatePipe],
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
