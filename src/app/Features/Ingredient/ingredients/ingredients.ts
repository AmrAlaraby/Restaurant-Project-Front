import { Component, OnInit } from '@angular/core';
import { IngredientsService } from '../../../Core/Services/Ingredients-Service/ingredients-Service';
import { IngredientInterface } from '../../../../app/Core/Models/MenuItemModels/ingredient-interface';
import { CommonModule } from '@angular/common';
import { Pagination } from "../../../Shared/Components/pagination/pagination"; // 👈 مهم جدًا

@Component({
  selector: 'app-ingredients',
  standalone: true,
  imports: [CommonModule, Pagination],
  templateUrl: './ingredients.html',
  styleUrls: ['./ingredients.scss'],
})

export class IngredientsComponent implements OnInit {

  ingredients: IngredientInterface[] = [];
  loading = true;
  pageIndex = 1;
  pageSize = 10;
  totalCount = 0;

  constructor(private ingredientService: IngredientsService) {}

  ngOnInit(): void {
    this.loadData();
  }


loadData() {
  this.loading = true;

  this.ingredientService.getAll(this.pageIndex, this.pageSize).subscribe({
    next: (res) => {
      this.ingredients = res.data;     // 👈 مهم
      this.totalCount = res.count;     // 👈 مهم
      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    }
  });
}

onPageChange(page: number) {
  this.pageIndex = page;
  this.loadData();
}

  delete(id: number) {
    this.ingredientService.delete(id).subscribe(() => {
      this.loadData();
    });
  }
}