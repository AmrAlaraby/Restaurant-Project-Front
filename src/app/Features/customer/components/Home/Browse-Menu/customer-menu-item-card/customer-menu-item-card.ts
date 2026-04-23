import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItemInterface } from '../../../../../../Core/Models/MenuItemModels/menu-item-interface';

@Component({
  selector: 'app-customer-menu-item-card',
  imports: [],
  templateUrl: './customer-menu-item-card.html',
  styleUrl: './customer-menu-item-card.scss',
})
export class CustomerMenuItemCard {
 @Input() item!: MenuItemInterface;
 @Output() add = new EventEmitter<MenuItemInterface>();

  onAdd() {
    this.add.emit(this.item);
  }
}
