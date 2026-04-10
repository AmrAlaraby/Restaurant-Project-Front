import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Ingredients } from '../../Constants/Api_Urls';
import { IngredientInterface } from '../../Models/MenuItemModels/ingredient-interface';

@Injectable({
  providedIn: 'root',
})
export class IngredientsService {
  private http = inject(HttpClient);

  getAll(): Observable<IngredientInterface[]> {
    return this.http.get<IngredientInterface[]>(Ingredients.getAll);
  }
}
