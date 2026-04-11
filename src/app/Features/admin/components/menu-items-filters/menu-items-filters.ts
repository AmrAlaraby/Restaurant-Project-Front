import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryInterface } from '../../../../Core/Models/MenuItemModels/category-interface';
import { MenuItemQueryParamsInterface } from '../../../../Core/Models/MenuItemModels/menu-item-query-params-interface';


@Component({
  selector: 'app-menu-items-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-items-filters.html',
  styleUrls: ['./menu-items-filters.scss'],
})
export class MenuItemsFilters {
  @Input() categories: CategoryInterface[] = [];

  @Input() filters: MenuItemQueryParamsInterface = {};

  @Output() filtersChanged = new EventEmitter<MenuItemQueryParamsInterface>();

  @Output() resetClicked = new EventEmitter<void>();

  onFilterChange(): void {
    this.filtersChanged.emit({ ...this.filters });
  }

  onReset(): void {
    this.resetClicked.emit();
  }
}
