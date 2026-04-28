import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableInterface } from '../../../../../Core/Models/TableModels/table-interface';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-table-card',
  standalone: true,
  imports:[TranslatePipe],
  templateUrl: './table-card.html',
  styleUrls: ['./table-card.scss'],
})
export class TableCard {
  @Input() table!: TableInterface;

  @Output() toggle = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() openOrder = new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();

  onEdit() {
    this.edit.emit(this.table.id);
  }

  onToggle() {
    this.toggle.emit(this.table.id);
  }

  onDelete() {
    this.delete.emit(this.table.id);
  }

  onOpenOrder() {
    if (this.table.isOccupied) {
      this.openOrder.emit(this.table.id);
    }
  }
}
