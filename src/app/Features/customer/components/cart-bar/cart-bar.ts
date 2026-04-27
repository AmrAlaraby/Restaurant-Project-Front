import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Basket } from '../../../../Core/Models/BasketModels/Basket';
import { BasketService } from '../../../../Core/Services/Basket-Service/baskets-service';


@Component({
  selector: 'app-cart-bar',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './cart-bar.html',
  styleUrl: './cart-bar.scss'
})
export class CartBar {

  basket$!: Observable<Basket | null>;

  constructor(
    private basketService: BasketService,
    private router: Router
  ) { }

  ngOnInit() {
    this.basket$ = this.basketService.basket$;
    this.basketService.loadBasket();
  }

  goToCart() {
    this.router.navigate(['/customer/basket']);
  }

  getCount(basket: Basket): number {
    return basket.items.reduce((s, i) => s + i.quantity, 0);
  }

  getTotal(basket: Basket): number {
    return basket.items.reduce((s, i) => s + i.price * i.quantity, 0);
  }
}