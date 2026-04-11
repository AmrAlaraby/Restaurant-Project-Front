import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MenuItemDetailsInterface } from '../../../../../../Core/Models/MenuItemModels/menu-item-details-interface';


@Component({
  selector: 'app-menu-item-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-item-details.html',
  styleUrls: ['./menu-item-details.scss'],
})
export class MenuItemDetails {
  @Input({ required: true })
  menuItem!: MenuItemDetailsInterface;

  showRecipes = false;

  toggleRecipes(): void {
    this.showRecipes = !this.showRecipes;
  }
}
