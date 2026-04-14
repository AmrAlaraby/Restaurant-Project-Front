import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Branch as BranchApi } from '../../Constants/Api_Urls';
import { Branch } from '../../Models/BranchModels/branch-interface';
import { BranchQueryParams } from '../../Models/BranchModels/branch-query-params';
import { CreateBranch } from '../../Models/BranchModels/create-branch';
import { GetBranch } from '../../Models/BranchModels/get-branch';
import { UpdateBranch } from '../../Models/BranchModels/update-branch';
import { PaginatedResult } from '../../Models/DeliveryModels/paginated-result';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private http = inject(HttpClient);

  getBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(BranchApi.getAll);
  }


getAllWithTables(params?: BranchQueryParams): Observable<PaginatedResult<GetBranch>> {
    let httpParams = new HttpParams();
    if (params?.role) httpParams = httpParams.set('role', params.role);
    if (params?.pageIndex) httpParams = httpParams.set('pageIndex', params.pageIndex);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);

    return this.http.get<PaginatedResult<GetBranch>>(BranchApi.getAllWithTables, {
      params: httpParams,
    });
  }

  getById(id: number): Observable<GetBranch> {
    return this.http.get<GetBranch>(BranchApi.getById(id));
  }

  create(branch: CreateBranch): Observable<GetBranch> {
    return this.http.post<GetBranch>(BranchApi.create, branch);
  }

  update(id: number, branch: UpdateBranch): Observable<GetBranch> {
    return this.http.put<GetBranch>(BranchApi.update(id), branch);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(BranchApi.delete(id));
  }

  toggleStatus(id: number): Observable<void> {
    return this.http.patch<void>(BranchApi.toggleStatus(id), {});
  }


}
