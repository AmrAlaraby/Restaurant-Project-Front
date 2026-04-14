import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItemInterface } from '../../../../../Core/Models/MenuItemModels/menu-item-interface';
import { Pagination } from "../../../../../Shared/Components/pagination/pagination";

@Component({
  selector: 'app-menu-list',
  imports: [CommonModule, Pagination],
  templateUrl: './menu-list.html',
  styleUrl: './menu-list.scss',
})
export class MenuList {
  @Input() items: MenuItemInterface[] = [];

  // pagination
  @Input() pageIndex = 1;
  @Input() pageSize = 8;
  @Input() totalCount = 0;

  @Output() add = new EventEmitter<MenuItemInterface>();
  @Output() pageChanged = new EventEmitter<number>();

  trackById(_: number, item: MenuItemInterface) {
    return item.id;
  }
}
