import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MenuItemInterface } from '../../../../../../Core/Models/MenuItemModels/menu-item-interface';



@Component({
  selector: 'app-menu-item-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-item-card.html',
  styleUrls: ['./menu-item-card.scss'],
})
export class MenuItemCard {
  @Input({ required: true })
  item!: MenuItemInterface;

  @Input()
  showAdminActions = true;

  @Input()
  showAvailability = true;

  @Input()
  compactMode = false;

  @Output()
  view = new EventEmitter<number>();

  @Output()
  edit = new EventEmitter<number>();

  @Output()
  delete = new EventEmitter<number>();

  @Output()
  toggleAvailability = new EventEmitter<number>();

  onView(): void {
    this.view.emit(this.item.id);
  }

  onEdit(): void {
    this.edit.emit(this.item.id);
  }

  onDelete(): void {
    this.delete.emit(this.item.id);
  }

  onToggleAvailability(): void {
    this.toggleAvailability.emit(this.item.id);
  }
}
