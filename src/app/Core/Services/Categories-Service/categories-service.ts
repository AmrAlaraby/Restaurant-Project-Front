import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CategoryInterface } from '../../Models/MenuItemModels/category-interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  getAll(): Observable<CategoryInterface[]> {
    return of([
      { id: 1, name: 'Burger' },
      { id: 2, name: 'Pizza' },
      { id: 3, name: 'Grills' },
      { id: 4, name: 'Salads' },
      { id: 5, name: 'Drinks' },
      { id: 6, name: 'Desserts' },
    ]);
  }
}
