import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Basket } from '../../Models/BasketModels/Basket';
import { BasketItem } from '../../Models/BasketModels/BasketItem';
import { Baskets } from '../../Constants/Api_Urls';


@Injectable({
  providedIn: 'root'
})
export class BasketService {

  private basketSource = new BehaviorSubject<Basket | null>(null);
  basket$ = this.basketSource.asObservable();

  constructor(private http: HttpClient) {}

  // Basket ID
  private getBasketId(): string {
    let id = localStorage.getItem('basket_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('basket_id', id);
    }
    return id;
  }

  // Load Basket
  loadBasket(): void {
    const id = this.getBasketId();

    this.http.get<Basket>(Baskets.get(id))
      .subscribe({
        next: basket => this.basketSource.next(basket),
        error: () => {
          // If there's no basket, create a new one
          this.createEmptyBasket();
        }
      });
  }

  // Create Empty Basket
  private createEmptyBasket(): void {
    const basket: Basket = {
      id: this.getBasketId(),
      items: []
    };

    this.basketSource.next(basket);
  }

  // Add Item
  addItem(item: BasketItem): void {
    const basket = this.getCurrentBasket();

    const existingItem = basket.items.find(x => x.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      basket.items.push(item);
    }

    this.setBasket(basket);
  }

  // Remove Item
  removeItem(itemId: number): void {
    const basket = this.getCurrentBasket();

    basket.items = basket.items.filter(x => x.id !== itemId);

    this.setBasket(basket);
  }

  // Update Quantity
  updateQuantity(itemId: number, quantity: number): void {
    const basket = this.getCurrentBasket();

    const item = basket.items.find(x => x.id === itemId);
    if (!item) return;

    item.quantity = quantity;

    if (item.quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    this.setBasket(basket);
  }

  // Clear Basket
  clearBasket(): void {
    const id = this.getBasketId();

    this.http.delete<boolean>(Baskets.delete(id)).subscribe(() => {
      this.basketSource.next(null);
      localStorage.removeItem('basket_id');
    });
  }

  // Sync with Backend
  private setBasket(basket: Basket): void {
    this.http.post<Basket>(Baskets.createOrUpdate, basket)
      .subscribe(updated => {
        this.basketSource.next(updated);
      });
  }

  // Helper
  private getCurrentBasket(): Basket {
    const basket = this.basketSource.value;

    if (!basket) {
      const newBasket: Basket = {
        id: this.getBasketId(),
        items: []
      };
      this.basketSource.next(newBasket);
      return newBasket;
    }

    return basket;
  }
}