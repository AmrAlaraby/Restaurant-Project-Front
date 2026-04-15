import { Component } from '@angular/core';
import { CategoryFilter } from "../../../waiter/components/place-order/category-filter/category-filter";
import { MenuList } from "../../../waiter/components/place-order/menu-list/menu-list";

@Component({
  selector: 'app-create-order',
  imports: [CategoryFilter, MenuList],
  templateUrl: './create-order.html',
  styleUrl: './create-order.scss',
})
export class CreateOrder {

}
