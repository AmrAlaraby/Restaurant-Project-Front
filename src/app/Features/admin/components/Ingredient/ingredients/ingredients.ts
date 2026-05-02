import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../Shared/Components/pagination/pagination';
import { IngredientInterface } from '../../../../../Core/Models/MenuItemModels/ingredient-interface';
import { IngredientsService } from '../../../../../Core/Services/Ingredients-Service/ingredients-Service';
import { ToastService } from '../../../../../Core/Services/Toast-Service/toast-service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'app-ingredients',
  standalone: true,
  imports: [CommonModule, Pagination, FormsModule, TranslatePipe],
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
  arabicName: '',
  unit: ''
  };

  constructor(private ingredientService: IngredientsService,
    private toast: ToastService,
    private localizationService: LocalizationService,
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.getCurrentLanguage();
  }

  CurrentLanguage: string = 'en';
    
      private destroy$ = new Subject<void>();
      getCurrentLanguage(): void {
        this.CurrentLanguage = this.localizationService.getCurrentLang();
        this.localizationService.currentLang$.pipe(takeUntil(this.destroy$)).subscribe((lang) => {
          this.CurrentLanguage = lang;
        });
      }
    
      ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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
      this.toast.error('Failed to load ingredients');
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
    this.newIngredient = { name: '', arabicName: '', unit: '' };
  }

  addIngredient() {
    this.ingredientService.create(this.newIngredient).subscribe({
      next: () => {
         this.toast.success('Ingredient added successfully!');
        this.closeModal();
        this.loadData();
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Failed to add ingredient');
      }
    });

  }
  getItemName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.arabicName || item.name;
    }
    return item.name;
  }
}
