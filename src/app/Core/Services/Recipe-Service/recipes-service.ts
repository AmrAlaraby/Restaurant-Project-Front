import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Recipes } from '../../Constants/Api_Urls';
import { PaginatedResult } from '../../Models/DeliveryModels/paginated-result';
import { AddRecipeDTO } from '../../Models/RecipeModels/add-recipe-dto';
import { RecipesListDTO } from '../../Models/RecipeModels/recipes-list-dto';
import { RecipesQueryParams } from '../../Models/RecipeModels/recipes-query-params';
import { UpdateRecipeDTO } from '../../Models/RecipeModels/update-recipe-dto';


@Injectable({ providedIn: 'root' })
export class RecipesService {
  private readonly http = inject(HttpClient);

  getRecipes(params: RecipesQueryParams): Observable<PaginatedResult<RecipesListDTO>> {
    let httpParams = new HttpParams();

    if (params.menuItemId != null) {
      httpParams = httpParams.set('menuItemId', params.menuItemId);
    }

    httpParams = httpParams
      .set('pageIndex', params.pageIndex ?? 1)
      .set('pageSize', params.pageSize ?? 5);

    return this.http.get<PaginatedResult<RecipesListDTO>>(Recipes.getAll, { params: httpParams });
  }

  addRecipe(dto: AddRecipeDTO): Observable<RecipesListDTO> {
    return this.http.post<RecipesListDTO>(Recipes.getAll, dto);
  }

  updateRecipe(id: number, dto: UpdateRecipeDTO): Observable<RecipesListDTO> {
    return this.http.put<RecipesListDTO>(Recipes.update(id), dto);
  }

  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<void>(Recipes.delete(id));
  }
}
