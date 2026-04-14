import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableOrderInterface } from '../../../../../Core/Models/TableModels/table-order-interface';

@Component({
  selector: 'app-order-details-modal',
  standalone: true,
  templateUrl: './order-details-modal.html',
  styleUrls: ['./order-details-modal.scss'],
})
export class OrderDetailsModal {
  @Input() isOpen = false;
  @Input() order: TableOrderInterface | null = null;

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
