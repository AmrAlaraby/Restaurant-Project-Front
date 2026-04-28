import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, Subscription, concatMap, filter, switchMap, take } from 'rxjs';
import { Basket } from '../../Models/BasketModels/Basket';
import { BasketItem } from '../../Models/BasketModels/BasketItem';
import { Baskets } from '../../Constants/Api_Urls';

@Injectable({
  providedIn: 'root'
})
export class BasketService implements OnDestroy {

  private readonly BASKET_ID_KEY = 'basket_id';

  private basketSource = new BehaviorSubject<Basket | null>(null);
  basket$ = this.basketSource.asObservable();

  private addItemQueue = new Subject<BasketItem>();
  private queueSubscription: Subscription;

  constructor(private http: HttpClient) {
    this.queueSubscription = this.addItemQueue.pipe(
      concatMap(item =>
        this.basket$.pipe(
          filter((basket): basket is Basket => basket !== null),
          take(1),
          switchMap(basket => this.processAddItem(basket, item))
        )
      )
    ).subscribe({
      next: res => this.basketSource.next(res),
      error: err => console.error('Add item failed:', err)
    });
  }

  // ─── Load / Init ────────────────────────────────────────────────────────────

  loadBasket(): void {
    const id = localStorage.getItem(this.BASKET_ID_KEY);

    if (!id) {
      this.createBasketOnServer();
      return;
    }

    this.http.get<Basket>(Baskets.get(id)).subscribe({
      next: basket => this.basketSource.next(basket),
      error: () => {
        // Basket expired or not found on Redis → create a new one
        localStorage.removeItem(this.BASKET_ID_KEY);
        this.createBasketOnServer();
      }
    });
  }

  private createBasketOnServer(): void {
    const basket: Basket = {
      id: crypto.randomUUID(),
      items: []
    };

    this.http.post<Basket>(Baskets.createOrUpdate, basket).subscribe({
      next: res => {
        localStorage.setItem(this.BASKET_ID_KEY, res.id);
        this.basketSource.next(res);
      },
      error: err => console.error('Failed to create basket:', err)
    });
  }

  // ─── Add Item ────────────────────────────────────────────────────────────────

  addItem(item: BasketItem): void {
    this.addItemQueue.next(item);
  }

  private processAddItem(current: Basket, item: BasketItem) {
    const existing = current.items.find(x => x.id === item.id);

    const updatedItems: BasketItem[] = existing
      ? current.items.map(i =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      )
      : [...current.items, item];

    return this.http.post<Basket>(Baskets.createOrUpdate, {
      ...current,
      items: updatedItems
    });
  }

  // ─── Remove Item ─────────────────────────────────────────────────────────────

  removeItem(itemId: number): void {
    const current = this.basketSource.value;
    if (!current) return;

    const updatedBasket: Basket = {
      ...current,
      items: current.items.filter(x => x.id !== itemId)
    };

    this.http.post<Basket>(Baskets.createOrUpdate, updatedBasket).subscribe({
      next: res => this.basketSource.next(res),
      error: err => console.error('Remove item failed:', err)
    });
  }

  // ─── Update Quantity ──────────────────────────────────────────────────────────

  updateQuantity(itemId: number, quantity: number): void {
    const current = this.basketSource.value;
    if (!current) return;

    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    const updatedBasket: Basket = {
      ...current,
      items: current.items.map(i =>
        i.id === itemId ? { ...i, quantity } : i
      )
    };

    this.http.post<Basket>(Baskets.createOrUpdate, updatedBasket).subscribe({
      next: res => this.basketSource.next(res),
      error: err => console.error('Update quantity failed:', err)
    });
  }

  // ─── Clear Basket ─────────────────────────────────────────────────────────────

  clearBasket(): void {
    const id = localStorage.getItem(this.BASKET_ID_KEY);
    if (!id) return;

    this.http.delete<boolean>(Baskets.delete(id)).subscribe({
      next: () => {
        localStorage.removeItem(this.BASKET_ID_KEY);
        this.createBasketOnServer();
      },
      error: err => console.error('Clear basket failed:', err)
    });
  }

  // ─── Cleanup ──────────────────────────────────────────────────────────────────

  ngOnDestroy(): void {
    this.queueSubscription.unsubscribe();
    this.addItemQueue.complete();
  }
}