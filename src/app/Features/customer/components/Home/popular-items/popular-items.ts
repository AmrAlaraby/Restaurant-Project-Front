import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItemInterface } from '../../../../../Core/Models/MenuItemModels/menu-item-interface';
import { MenuItemsService } from '../../../../../Core/Services/Menu-Item-Service/menu-item-service';
import { CustomerMenuItemCard } from "../Browse-Menu/customer-menu-item-card/customer-menu-item-card";

@Component({
  selector: 'app-popular-items',
  imports: [CustomerMenuItemCard],
  templateUrl: './popular-items.html',
  styleUrl: './popular-items.scss',
})
export class PopularItems {
private menuService = inject(MenuItemsService);
  private router = inject(Router);

  popularItems: MenuItemInterface[] = [];

  ngOnInit() {
    this.menuService.getPopular().subscribe(res => {
      this.popularItems = res;
    });
  }

  goToBrowse() {
    this.router.navigate(['/customer/browse-menu']);
  }

  
}
