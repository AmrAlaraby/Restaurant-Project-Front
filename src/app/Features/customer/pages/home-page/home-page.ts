import { Component, inject } from '@angular/core';
import { CategoryList } from "../../components/Home/category-list/category-list";
import { PopularItems } from '../../components/Home/popular-items/popular-items';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [CategoryList,PopularItems],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
private router = inject(Router);

goToBrowse() {
  this.router.navigate(['/browse-menu']);
}
}
