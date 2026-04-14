import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateOrderItemInterface } from '../../../../../Core/Models/OrderModels/create-order-item-interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-summary',
  imports: [CommonModule],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.scss',
})
export class OrderSummary {

  @Input() items: any[] = [];
  @Input() total = 0;

  @Output() remove = new EventEmitter<number>();
  @Output() decrease = new EventEmitter<number>();
}
