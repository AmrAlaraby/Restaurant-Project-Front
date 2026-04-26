import { Component, EventEmitter, input, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { CategoryInterface } from '../../../../../Core/Models/MenuItemModels/category-interface';
import { MenuItemQueryParamsInterface } from '../../../../../Core/Models/MenuItemModels/menu-item-query-params-interface';
import { Branch } from '../../../../../Core/Models/BranchModels/branch-interface';

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

  @Input() branches : Branch[] = [];

  @Output() filtersChanged = new EventEmitter<MenuItemQueryParamsInterface>();

  @Output() resetClicked = new EventEmitter<void>();

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
      this.filters.pageIndex = 1;

      this.filtersChanged.emit({
        ...this.filters,
      });
    });
  }

  // onFilterChange(field?: string): void {
  //   if (field === 'search') {
  //     this.searchSubject.next(this.filters.search || '');
  //     return;
  //   }

  //   this.filters.pageIndex = 1;

  //   this.filtersChanged.emit({
  //     ...this.filters,
  //   });
  // }

  onFilterChange(field?: string): void {
    if (field === 'search') {
      const value = this.filters.search || '';
      this.searchSubject.next(value);
      return;
    }

    this.filtersChanged.emit({
      ...this.filters,
      pageIndex: 1,
    });
  }
  
  onReset(): void {
    this.resetClicked.emit();
  }
}
