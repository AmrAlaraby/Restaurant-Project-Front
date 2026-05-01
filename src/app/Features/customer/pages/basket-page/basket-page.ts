import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Basket } from '../../../../Core/Models/BasketModels/Basket';
import { BasketService } from '../../../../Core/Services/Basket-Service/baskets-service';
import { AsyncPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';
import { PaymentService } from '../../../../Core/Services/Payment-Service/payment-service';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { CreateOrderInterface } from '../../../../Core/Models/OrderModels/create-order-interface';
import { AddressDto } from '../../../../Core/Models/AuthModels/address-dto';
import { AddAddressModal } from '../../components/Home/Address-Model/add-address-modal/add-address-modal';
import { BasketItem } from '../../../../Core/Models/BasketModels/BasketItem';
import { NutritionModal } from "../../components/Ai/nutrition-modal/nutrition-modal";
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizationService } from '../../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'app-basket-page',
  standalone: true,
  imports: [
    FormsModule, 
    AsyncPipe, 
    RouterModule, 
    AddAddressModal, 
    NutritionModal,
    TranslatePipe,
  ],
  templateUrl: './basket-page.html',
  styleUrl: './basket-page.scss',
})
export class BasketPage {

  basket$!: Observable<Basket | null>;

  orderType: 'Delivery' | 'PickUp' = 'Delivery';
  paymentMethod: 'Card' | 'Cash' = 'Card';

  savedAddresses: AddressDto[] = [];
  selectedAddress: AddressDto | null = null;

  showAddressModal = false;

  constructor(
    private localizationService: LocalizationService,
    private basketService: BasketService,
    private ordersService: OrdersService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.basket$ = this.basketService.basket$;
    this.basketService.loadBasket();
    this.loadUserAddresses();
    this.getCurrentLanguage();
  }

  CurrentLanguage: string = 'en';
    
      private destroy$ = new Subject<void>();
      getCurrentLanguage(): void {
        this.CurrentLanguage = this.localizationService.getCurrentLang();
        this.localizationService.currentLang$.pipe(takeUntil(this.destroy$)).subscribe((lang) => {
          this.CurrentLanguage = lang;
        });
      }
    
      ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
      }

  // =========================
  // Basket Actions
  // =========================

  increase(item: BasketItem) {
    this.basketService.updateQuantity(item.id, item.quantity + 1);
  }

  decrease(item: BasketItem) {
    this.basketService.updateQuantity(item.id, item.quantity - 1);
  }

  removeItem(id: number) {
    this.basketService.removeItem(id);
  }

  // =========================
  // Helpers
  // =========================

  getTotal(basket: Basket): number {
    return basket.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  }

  formatAddress(addr: AddressDto): string {
    return `${addr.buildingNumber} ${addr.street}, ${addr.city}`;
  }

  onAddressSelect(event: Event) {
    const index = +(event.target as HTMLSelectElement).value;
    this.selectedAddress = this.savedAddresses[index] ?? null;
  }

  // =========================
  // Address Modal
  // =========================

  goToAddAddress() {
    this.showAddressModal = true;
  }

  onModalClosed() {
    this.showAddressModal = false;
  }

  onAddressAdded(addresses: AddressDto[]) {
    this.showAddressModal = false;
    this.savedAddresses = addresses; // ✅ بناخد العناوين من الـ response مباشرة
    if (addresses.length > 0) {
      this.selectedAddress = addresses[addresses.length - 1]; // ✅ بنختار العنوان الجديد
    }
  }

  private loadUserAddresses() {
    this.authService.getUserAddresses().subscribe({
      next: (addresses) => {
        this.savedAddresses = addresses;
        if (addresses.length > 0) {
          this.selectedAddress = addresses[0];
        }
      },
      error: (err) => console.error('Failed to load addresses', err)
    });
  }

  // =========================
  // Order
  // =========================

  placeOrder(basket: Basket) {

    if (!basket.items.length) return;

    if (this.orderType === 'Delivery' && !this.selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    this.authService.getCurrentUser().subscribe({
      next: (user) => {

        const dto: CreateOrderInterface = {
          userId: user.id,
          branchId: 1,
          orderType: this.orderType,
          paymentMethod: this.paymentMethod,
          deliveryAddress: this.orderType === 'Delivery' && this.selectedAddress
            ? {
                buildingNumber: this.selectedAddress.buildingNumber,
                street: this.selectedAddress.street,
                city: this.selectedAddress.city
              }
            : undefined,
          items: basket.items.map(i => ({
            menuItemId: i.id,
            quantity: i.quantity,
            unitPrice: i.price
          }))
        };

        this.ordersService.createOrder(dto as any).subscribe({
          next: (order) => {

            if (this.paymentMethod === 'Card') {
              this.paymentService.pay(order.id).subscribe({
                next: (res) => {
                  window.location.href = res.iframeUrl;
                }
              });
              return;
            }

            this.basketService.clearBasket();
            this.router.navigate(['/customer/order-success']);
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
  getItemName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.arabicName || item.name;
    }
    return item.name;
  }
  
}
