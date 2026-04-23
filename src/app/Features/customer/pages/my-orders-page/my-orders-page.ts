import { Component, inject, signal } from '@angular/core';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-orders-page',
  imports: [FormsModule,CommonModule],
  templateUrl: './my-orders-page.html',
  styleUrl: './my-orders-page.scss',
})
export class MyOrdersPage {
}
