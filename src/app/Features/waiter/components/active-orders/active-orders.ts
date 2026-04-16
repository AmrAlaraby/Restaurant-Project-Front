import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-active-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-orders.html',
  styleUrl: './active-orders.scss'
})
export class ActiveOrders {

  @Input() orders: any[] = [];

}