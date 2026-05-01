import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-orders-empty-state',
  imports: [TranslatePipe],
  templateUrl: './orders-empty-state.html',
  styleUrl: './orders-empty-state.scss',
})
export class OrdersEmptyState {

}
