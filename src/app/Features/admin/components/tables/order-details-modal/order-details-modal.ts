import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { TableOrderInterface } from '../../../../../Core/Models/TableModels/table-order-interface';
import { DeliveryService } from '../../../../../Core/Services/Delivery-Service/delivery-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-details-modal',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './order-details-modal.html',
  styleUrls: ['./order-details-modal.scss'],
})
export class OrderDetailsModal {
  private deliveryService = inject(DeliveryService);
  @Input() isOpen = false;
  @Input() order: TableOrderInterface | null = null;

  @Output() close = new EventEmitter<void>();
  updateModel = {
  status: '',
  cashCollected: 0
};

  onClose() {
    this.close.emit();
  }
  updateOrderStatus(status: string) {
  if (!this.order) return;

  this.deliveryService.updateStatus(this.order.id, {
    status: status
  }).subscribe({
    next: (res) => {
      console.log('Status updated');
    },
    error: (err) => {
      console.error(err);
    }
  });
}
}
