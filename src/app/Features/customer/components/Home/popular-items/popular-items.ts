import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItemInterface } from '../../../../../Core/Models/MenuItemModels/menu-item-interface';
import { MenuItemsService } from '../../../../../Core/Services/Menu-Item-Service/menu-item-service';
import { CustomerMenuItemCard } from "../Browse-Menu/customer-menu-item-card/customer-menu-item-card";
import { BranchStateService } from '../../../../../Core/Services/Branch-Service/branch-state-service';

@Component({
  selector: 'app-popular-items',
  standalone: true,
  imports: [CustomerMenuItemCard],
  templateUrl: './popular-items.html',
  styleUrl: './popular-items.scss',
})
export class PopularItems {

  private menuService = inject(MenuItemsService);
  private router = inject(Router);
  private branchState = inject(BranchStateService); 

  popularItems: MenuItemInterface[] = [];

  ngOnInit() {

    this.branchState.selectedBranch$.subscribe(branch => {
      if (branch) {
        this.loadPopular();
      }
    });

  }

  loadPopular() {

    const branchId = this.branchState.getCurrentBranchId();

    this.menuService.getPopular(branchId || undefined)
      .subscribe(res => {
        this.popularItems = res;
      });

  }

  goToBrowse() {
    this.router.navigate(['/customer/browse-menu']);
  }

}