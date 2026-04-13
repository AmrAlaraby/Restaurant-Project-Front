import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BranchDto } from '../../../../Core/Models/BranchModels/Branch-dto';

@Component({
  selector: 'app-order-filters',
  imports: [FormsModule],
  templateUrl: './order-filters.html',
  styleUrl: './order-filters.scss',
})
export class OrderFilters {
  @Input() branches : BranchDto[] = [];
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
