import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Basket } from '../../../../Core/Models/BasketModels/Basket';
import { BasketService } from '../../../../Core/Services/Basket-Service/baskets-service';


@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './cart-icon.html',
  styleUrl: './cart-icon.scss'
})
export class CartIcon {

  basket$!: Observable<Basket | null>;

  constructor(
    private basketService: BasketService,
    private router: Router
  ) { }

  ngOnInit() {
    this.basket$ = this.basketService.basket$;
  }

  goToCart() {
    this.router.navigate(['/customer/basket']);
  }

  getCount(basket: Basket): number {
    return basket.items.reduce((s, i) => s + i.quantity, 0);
  }
}