import { Component } from '@angular/core';
import { TableSelector } from "../../components/place-order/table-selector/table-selector";
import { CategoryFilter } from "../../components/place-order/category-filter/category-filter";
import { MenuList } from "../../components/place-order/menu-list/menu-list";
import { OrderSummary } from "../../components/place-order/order-summary/order-summary";
import { PaymentSelector } from "../../components/place-order/payment-selector/payment-selector";

@Component({
  selector: 'app-place-order',
  imports: [TableSelector, CategoryFilter, MenuList, OrderSummary, PaymentSelector],
  templateUrl: './place-order.html',
  styleUrl: './place-order.scss',
})
export class PlaceOrder {

}
