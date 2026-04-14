import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../../../Core/Models/CategoryModels/Category ';

@Component({
  selector: 'app-category-filter',
  imports: [],
  templateUrl: './category-filter.html',
  styleUrl: './category-filter.scss',
})
export class CategoryFilter {
  @Input() categories: Category[] = [];
  @Input() selectedCategoryId?: number;

  @Output() select = new EventEmitter<number | undefined>();

  onSelect(categoryId?: number): void {
    this.select.emit(categoryId);
  }

  isActive(categoryId?: number): boolean {
    return this.selectedCategoryId === categoryId;
  }
}
