import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserQueryParams } from '../Models/UserModels/user-query-params';
import { User } from '../Models/UserModels/user';
import { PaginatedResultInterface } from '../Models/MenuItemModels/paginated-result-interface';
import { AddUser } from '../Models/UserModels/add-user';
import { Users } from '../Constants/Api_Urls';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl = 'https://localhost:7232/api/User';

  constructor(private http: HttpClient) {}

  getUsers(params: UserQueryParams) {
    let httpParams = new HttpParams()
      .set('pageIndex', params.pageIndex.toString())
      .set('pageSize', params.pageSize.toString());

    if (params.roleId && params.roleId !== 'All') {
      httpParams = httpParams.set('roleId', params.roleId);
    }

    if (params.branchId) {
      httpParams = httpParams.set('branchId', params.branchId.toString());
    }

    return this.http.get<PaginatedResultInterface<User>>(this.baseUrl, {
      params: httpParams,
    });
  }

  getInactiveUsers(params: UserQueryParams) {
    let httpParams = new HttpParams()
      .set('pageIndex', params.pageIndex)
      .set('pageSize', params.pageSize);

    if (params.roleId && params.roleId !== 'All') {
      httpParams = httpParams.set('roleId', params.roleId);
    }

    return this.http.get<PaginatedResultInterface<User>>(`${this.baseUrl}/inactive`, {
      params: httpParams,
    });
  }

  toggleUser(id: string) {
    return this.http.patch<void>(`${this.baseUrl}/${id}/toggle-status`, {});
  }

  createUser(user: AddUser) {
    return this.http.post(this.baseUrl, user);
  }
}
