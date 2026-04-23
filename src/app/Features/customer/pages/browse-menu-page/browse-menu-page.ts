import { Component, inject } from '@angular/core';
import { MenuItemCard } from "../../../admin/components/MenuItem/menu-item-card/menu-item-card";
import { MenuItemInterface } from '../../../../Core/Models/MenuItemModels/menu-item-interface';
import { CustomerMenuItemCard } from "../../components/Home/Browse-Menu/customer-menu-item-card/customer-menu-item-card";
import { MenuItemsService } from '../../../../Core/Services/Menu-Item-Service/menu-item-service';
import { Pagination } from "../../../../Shared/Components/pagination/pagination";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Category } from '../../../../Core/Models/CategoryModels/Category ';
import { CategoryService } from '../../../../Core/Services/Categories-Service/categories-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-browse-menu-page',
  imports: [CustomerMenuItemCard, Pagination,ReactiveFormsModule],
  templateUrl: './browse-menu-page.html',
  styleUrl: './browse-menu-page.scss',
})
export class BrowseMenuPage {
cartCount = 1;
totalPrice = 625;
  router: any;
  goToCart() {
    this.router.navigate(['/cart']);
  }

private route = inject(ActivatedRoute);
sort = 0;
  private categoryService = inject(CategoryService);
  private menuService = inject(MenuItemsService);

  items: MenuItemInterface[] = [];
  categories: Category[] = [];

  // pagination
  pageIndex = 1;
  pageSize = 6;
  totalCount = 0;

  // filters
  selectedCategoryId: number | null = null;
  searchControl = new FormControl('');

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
}

 
  handleSearch() {
    this.searchControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(value => {
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
}
