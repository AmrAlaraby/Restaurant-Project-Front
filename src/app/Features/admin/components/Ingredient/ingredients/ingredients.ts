import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../Shared/Components/pagination/pagination';
import { IngredientInterface } from '../../../../../Core/Models/MenuItemModels/ingredient-interface';
import { IngredientsService } from '../../../../../Core/Services/Ingredients-Service/ingredients-Service';

@Component({
  selector: 'app-ingredients',
  standalone: true,
  imports: [CommonModule, Pagination, FormsModule],
  templateUrl: './ingredients.html',
  styleUrls: ['./ingredients.scss'],
})

export class IngredientsComponent implements OnInit {

  ingredients: IngredientInterface[] = [];
  loading = true;
  pageIndex = 1;
  pageSize = 10;
  totalCount = 0;
  showModal = false;

  newIngredient = {
  name: '',
  unit: ''
  };

  constructor(private ingredientService: IngredientsService) {}

  ngOnInit(): void {
    this.loadData();
  }


loadData() {
  this.loading = true;

  this.ingredientService.getAll(this.pageIndex, this.pageSize).subscribe({
    next: (res) => {
      console.log(res);

      this.ingredients = res.data || [];
      this.totalCount = res.count;
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
  openModal() {
    this.showModal = true;
    console.log(this.showModal);
  }

  closeModal() {
    this.showModal = false;
    this.newIngredient = { name: '', unit: '' };
  }

  addIngredient() {
    this.ingredientService.create(this.newIngredient).subscribe({
      next: () => {
        this.closeModal();
        this.loadData();
      },
      error: (err) => {
        console.error(err);
      }
    });

  }
}
