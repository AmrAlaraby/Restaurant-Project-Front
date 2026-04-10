import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CategoryInterface } from '../../Models/MenuItemModels/category-interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  getAll(): Observable<CategoryInterface[]> {
    return of([
      { id: 1, name: 'Pizza' },
      { id: 2, name: 'Burger' },
      { id: 3, name: 'Drinks' },
      { id: 4, name: 'Desserts' },
    ]);
  }
}
