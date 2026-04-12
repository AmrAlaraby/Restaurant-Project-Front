import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categories } from '../../Constants/Api_Urls';
import { Category } from '../../Models/CategoryModels/Category ';
import { CreateCategory } from '../../Models/CategoryModels/CreateCategory ';
import { UpdateCategory } from '../../Models/CategoryModels/UpdateCategory ';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  // GET ALL
  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(Categories.getAll);
  }

  // GET BY ID
  getById(id: number): Observable<Category> {
    return this.http.get<Category>(Categories.getById(id));
  }

  // CREATE
  create(dto: CreateCategory): Observable<Category> {
    return this.http.post<Category>(Categories.create, dto);
  }

  // UPDATE
  update(id: number, dto: UpdateCategory): Observable<Category> {
    return this.http.put<Category>(Categories.update(id), dto);
  }

  // DELETE
  delete(id: number): Observable<void> {
    return this.http.delete<void>(Categories.delete(id));
  }

  // getAll(): Observable<CategoryInterface[]> {
  //   return of([
  //     { id: 1, name: 'Burger' },
  //     { id: 2, name: 'Pizza' },
  //     { id: 3, name: 'Grills' },
  //     { id: 4, name: 'Salads' },
  //     { id: 5, name: 'Drinks' },
  //     { id: 6, name: 'Desserts' },
  //   ]);
  // }
}
