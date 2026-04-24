import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryService } from '../../../../Core/Services/Delivery-Service/delivery-service';
import { Delivery } from '../../../../Core/Models/DeliveryModels/delivery';

@Component({
  selector: 'app-branch-delivery-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './branch-delivery-details.html',
  styleUrls: ['./branch-delivery-details.scss'],
})
export class BranchDeliveryDetails implements OnInit {

  @Input() deliveryId!: number;
  @Output() back = new EventEmitter<void>();

  delivery?: Delivery;
  loading = false;

  constructor(private service: DeliveryService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.service.getById(this.deliveryId).subscribe({
      next: (res) => {
        this.delivery = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  goBack(): void {
    this.back.emit();
  }
}
