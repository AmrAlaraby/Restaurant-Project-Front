import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { Basket } from '../../../../Core/Models/BasketModels/Basket';
import { BasketService } from '../../../../Core/Services/Basket-Service/baskets-service';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-basket-page',
  standalone: true,
  imports: [FormsModule, AsyncPipe, RouterModule],
  templateUrl: './basket-page.html',
  styleUrl: './basket-page.scss',
})
export class BasketPage {


  basket$!: Observable<Basket | null>;

  orderType: 'Delivery' | 'Pickup' = 'Delivery';
  paymentMethod: 'Card' | 'Cash' = 'Card';

  address: string = '';

  constructor(private basketService: BasketService) { }

  ngOnInit() {
    this.basket$ = this.basketService.basket$;
    this.basketService.loadBasket();
  }

  removeItem(id: number) {
    this.basketService.removeItem(id);
  }

  increase(item: any) {
    this.basketService.updateQuantity(item.id, item.quantity + 1);
  }

  decrease(item: any) {
    this.basketService.updateQuantity(item.id, item.quantity - 1);
  }

  getTotal(basket: Basket): number {
    return basket.items.reduce((s, i) => s + i.price * i.quantity, 0);
  }
}