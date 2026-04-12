import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Ingredients } from '../../Constants/Api_Urls';
import { IngredientInterface } from '../../Models/MenuItemModels/ingredient-interface';
import { PaginatedResultInterface } from '../../Models/MenuItemModels/paginated-result-interface';
import { CreateIngredientInterface } from '../../Models/IngredientModels/Create-Ingredient-interface';

@Injectable({
  providedIn: 'root',
})
export class IngredientsService {
  private http = inject(HttpClient);

  getAll(pageIndex: number = 1, pageSize: number = 10): Observable<PaginatedResultInterface<IngredientInterface>> {
    return this.http.get<PaginatedResultInterface<IngredientInterface>>(
      `${Ingredients.getAll}?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
  }

  getById(id: number): Observable<IngredientInterface> {
    return this.http.get<IngredientInterface>(Ingredients.getById(id));
  }

  create(data: CreateIngredientInterface): Observable<IngredientInterface> {
    return this.http.post<IngredientInterface>(Ingredients.create, data);
  }

  update(id: number, data: CreateIngredientInterface): Observable<IngredientInterface> {
    return this.http.put<IngredientInterface>(Ingredients.update(id), data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(Ingredients.delete(id));
  }
}