import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../Models/UserModels/user';
import { PaginatedResultInterface } from '../../Models/MenuItemModels/paginated-result-interface';
import { AddUser } from '../../Models/UserModels/add-user';
import { UpdateUser } from '../../Models/UserModels/update-user';

import { UserQueryParams } from '../../Models/UserModels/user-query-params';
import { Branch, Users } from '../../Constants/Api_Urls';
import { BranchDto } from '../../Models/BranchModels/Branch-dto';
import { UserDetails } from '../../Models/UserModels/user-details';
import { CustomerInterface } from '../../Models/UserModels/customer-interface';
import { CreateCustomerInterface } from '../../Models/UserModels/create-customer-interface';
import { DeliveryAddress } from '../../Models/UserModels/delivery-address';


@Injectable({
  providedIn: 'root',
})
export class UsersService {

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

    return this.http.get<PaginatedResultInterface<User>>(Users.getAll, {
      params: httpParams,
    });
  }

  getInactiveUsers(params: UserQueryParams) {
    let httpParams = new HttpParams()
      .set('pageIndex', params.pageIndex.toString())
      .set('pageSize', params.pageSize.toString());

    if (params.roleId && params.roleId !== 'All') {
      httpParams = httpParams.set('roleId', params.roleId);
    }

    return this.http.get<PaginatedResultInterface<User>>(Users.getInactive, {
      params: httpParams,
    });
  }

  getRoles() {
    return this.http.get<string[]>(Users.getRoles);
  }

  getBranches() {
    return this.http.get<BranchDto[]>(Branch.getAll);
  }

  toggleUser(id: string) {
    return this.http.patch<void>(Users.toggle(id), {});
  }

  createUser(user: AddUser) {
    return this.http.post<User>(Users.create, user);
  }

  updateUser(user: UpdateUser) {
    return this.http.put<User>(Users.update(user.id), user);
  }

  getUserDetails(id: string) {
    return this.http.get<UserDetails>(Users.getById(id));
  }

  searchCustomers(phone: string) {

  let params = new HttpParams()
    .set('phoneNumber', phone)
    .set('pageIndex', 1)
    .set('pageSize', 5);

  return this.http.get<PaginatedResultInterface<CustomerInterface>>(
    Users.searchCustomers,
    { params }
  );
  }
  addCustomer(dto: CreateCustomerInterface) {
  return this.http.post<CustomerInterface>(Users.addCustomer, dto);
}
  updateCustomerAddress(customerId: string, address: DeliveryAddress) {
  return this.http.put<CustomerInterface>(
    Users.updateCustomerAddress(customerId),
    { addressDTO: address }
  );
}


}
