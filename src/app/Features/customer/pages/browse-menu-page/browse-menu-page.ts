import { Component, inject, OnInit } from '@angular/core';
import { CustomerMenuItemCard } from "../../components/Home/Browse-Menu/customer-menu-item-card/customer-menu-item-card";
import { MenuItemInterface } from '../../../../Core/Models/MenuItemModels/menu-item-interface';
import { MenuItemsService } from '../../../../Core/Services/Menu-Item-Service/menu-item-service';
import { Pagination } from "../../../../Shared/Components/pagination/pagination";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { Category } from '../../../../Core/Models/CategoryModels/Category ';
import { CategoryService } from '../../../../Core/Services/Categories-Service/categories-service';
import { ActivatedRoute, Router } from '@angular/router';
import { BasketService } from '../../../../Core/Services/Basket-Service/baskets-service';
import { Basket } from '../../../../Core/Models/BasketModels/Basket';
import { AsyncPipe } from '@angular/common';
import { CartBar } from "../../components/cart-bar/cart-bar";

@Component({
  selector: 'app-browse-menu-page',
  standalone: true,
  imports: [CustomerMenuItemCard, Pagination, ReactiveFormsModule, AsyncPipe, CartBar],
  templateUrl: './browse-menu-page.html',
  styleUrls: ['./browse-menu-page.scss'],
})
export class BrowseMenuPage implements OnInit {

  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);
  private menuService = inject(MenuItemsService);

  constructor(
    private basketService: BasketService,
    // private router: Router
  ) { }
  private router = inject(Router);
  basket$!: Observable<Basket | null>;

  items: MenuItemInterface[] = [];
  categories: Category[] = [];

  pageIndex = 1;
  pageSize = 6;
  totalCount = 0;

  selectedCategoryId: number | null = null;
  searchControl = new FormControl('');
  sort = 0;

  ngOnInit(): void {
    this.loadCategories();

    this.route.queryParams.subscribe(params => {
      this.selectedCategoryId = params['categoryId']
        ? +params['categoryId']
        : null;

      this.pageIndex = 1;
      this.loadItems();
    });

    this.handleSearch();

    // 🔥 basket
    this.basket$ = this.basketService.basket$;
    this.basketService.loadBasket();
  }

  goToCart() {
    console.log('GO TO CART');
    this.router.navigateByUrl('/customer/basket');
  }
  handleSearch() {
    this.searchControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(() => {
      this.pageIndex = 1;
      this.loadItems();
    });
  }

  loadItems() {
    this.menuService.getAll({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      search: this.searchControl.value || undefined,
      categoryId: this.selectedCategoryId || undefined,
      isAvailable: true,
      sort: this.sort === 0 ? undefined : this.sort
    }).subscribe(res => {
      this.items = res.data;
      this.totalCount = res.count;
    });
  }

  onPageChange(page: number) {
    this.pageIndex = page;
    this.loadItems();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(res => {
      this.categories = res;
    });
  }

  selectCategory(id: number | null) {
    this.selectedCategoryId = id;
    this.pageIndex = 1;
    this.loadItems();
  }

  changeSort(value: number) {
    this.sort = value;
    this.pageIndex = 1;
    this.loadItems();
  }


  getCount(basket: Basket): number {
    return basket.items.reduce((s, i) => s + i.quantity, 0);
  }

  getTotal(basket: Basket): number {
    return basket.items.reduce((s, i) => s + i.price * i.quantity, 0);
  }
}