import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderInterface } from '../../../../../Core/Models/OrderModels/order-interface';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-order-table',
  imports: [NgClass,TranslatePipe],
  templateUrl: './order-table.html',
  styleUrl: './order-table.scss',
})
export class OrderTable {
@Input() orders: OrderInterface[] = [];
@Output() view = new EventEmitter<number>();

  onView(id: number) {
    this.view.emit(id);
    console.log("clicked");

  }
}
