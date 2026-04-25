import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Basket } from '../../../../Core/Models/BasketModels/Basket';
import { BasketService } from '../../../../Core/Services/Basket-Service/baskets-service';
import { AsyncPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';
import { PaymentService } from '../../../../Core/Services/Payment-Service/payment-service';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { CreateOrderInterface } from '../../../../Core/Models/OrderModels/create-order-interface';

@Component({
  selector: 'app-basket-page',
  standalone: true,
  imports: [FormsModule, AsyncPipe, RouterModule],
  templateUrl: './basket-page.html',
  styleUrl: './basket-page.scss',
})
export class BasketPage {

  basket$!: Observable<Basket | null>;

  orderType: 'Delivery' | 'PickUp' = 'Delivery';
  paymentMethod: 'Card' | 'Cash' = 'Card';

  address: string = '';

  constructor(
    private basketService: BasketService,
    private ordersService: OrdersService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router
  ) { }

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

  // 🔥 mapping functions
  private mapPaymentMethod(value: string): string {
    switch (value) {
      case 'Card': return 'Card';
      case 'Cash': return 'Cash';
      default: return 'Cash';
    }
  }

  private mapOrderType(value: string): string {
    switch (value) {
      case 'Delivery': return 'Delivery';
      case 'PickUp': return 'PickUp';
      default: return 'PickUp';
    }
  }

  placeOrder(basket: Basket) {

    if (!basket.items.length) return;

    if (this.orderType === 'Delivery' && !this.address) {
      alert('Enter address');
      return;
    }

    this.authService.getCurrentUser().subscribe({
      next: (user) => {

        // ✅ DTO (string)
        const dto :CreateOrderInterface = {
          userId: user.id,
          branchId: 1,

          orderType: this.orderType,
          paymentMethod: this.paymentMethod,

          deliveryAddress: this.orderType === 'Delivery'
            ? {
              buildingNumber: 1,
              street: this.address,
              city: 'Cairo'
            }
            : undefined,

          items: basket.items.map(i => ({
            menuItemId: i.id,
            quantity: i.quantity,
            unitPrice: i.price
          }))
        };

        // ✅ API DTO (numbers)
        const apiDto :CreateOrderInterface = {
          ...dto,
          paymentMethod: this.mapPaymentMethod(dto.paymentMethod),
          orderType: this.mapOrderType(dto.orderType)
        };

        this.ordersService.createOrder(apiDto as any).subscribe({
          next: (order) => {

            // 🟢 CARD
            if (this.paymentMethod === 'Card') {
              this.paymentService.pay(order.id).subscribe({
                next: (res) => {
                  window.location.href = res.iframeUrl;
                }
              });
              return;
            }

            // 🟡 CASH
            this.basketService.clearBasket();
            this.router.navigate(['/order-success']);
          },
          error: err => {
            console.error(err);
            alert('Create order failed');
          }
        });

      },
      error: err => {
        console.error(err);
        alert('Failed to get user');
      }
    });
  }
}