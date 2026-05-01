import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-orders-header',
  imports: [TranslatePipe],
  templateUrl: './orders-header.html',
  styleUrl: './orders-header.scss',
})
export class OrdersHeader {}