import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-filters',
  imports: [FormsModule],
  templateUrl: './order-filters.html',
  styleUrl: './order-filters.scss',
})
export class OrderFilters {
@Output() filterChange = new EventEmitter();

  filters: any = {
    Ordertype: '',
    status: '',
    branchId: ''
  };

  emit() {
    this.filterChange.emit(this.filters);
  }
}
