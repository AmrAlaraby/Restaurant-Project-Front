import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';

import { MenuItemCard } from '../menu-item-card/menu-item-card';
import { MenuItemInterface } from '../../../../../Core/Models/MenuItemModels/menu-item-interface';


@Component({
  selector: 'app-menu-items-grid',
  standalone: true,
  imports: [CommonModule, MenuItemCard],
  templateUrl: './menu-items-grid.html',
  styleUrls: ['./menu-items-grid.scss'],
})
export class MenuItemsGrid {
  @Input()
  items: MenuItemInterface[] = [];

  @Input()
  loading = false;

  @Output()
  view = new EventEmitter<number>();

  @Output()
  edit = new EventEmitter<number>();

  @Output()
  delete = new EventEmitter<number>();

  @Output()
  toggleAvailability = new EventEmitter<number>();

  onView(id: number): void {
    this.view.emit(id);
  }

  onEdit(id: number): void {
    this.edit.emit(id);
  }

  onDelete(id: number): void {
    this.delete.emit(id);
  }

  onToggle(id: number): void {
    this.toggleAvailability.emit(id);
  }
}
