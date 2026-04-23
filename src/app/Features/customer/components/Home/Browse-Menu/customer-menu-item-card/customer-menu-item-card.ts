import { Component, Input } from '@angular/core';
import { MenuItemInterface } from '../../../../../../Core/Models/MenuItemModels/menu-item-interface';
import { BasketService } from '../../../../../../Core/Services/Basket-Service/baskets-service';

@Component({
  selector: 'app-customer-menu-item-card',
  standalone: true,
  templateUrl: './customer-menu-item-card.html',
  styleUrls: ['./customer-menu-item-card.scss'],
})
export class CustomerMenuItemCard {

  @Input() item!: MenuItemInterface;

  constructor(private basketService: BasketService) { }

  addToCart(item: MenuItemInterface) {
    this.basketService.addItem({
      id: item.id,
      name: item.name,
      pictureUrl: item.imageUrl,
      price: item.price,
      quantity: 1
    });
  }
}