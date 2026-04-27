import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../../Constants/Api_Urls';
import { AddCustomerAddressDto } from '../../Models/AddressModels/add-customer-address-dto';
import { DeleteAddressDto } from '../../Models/AddressModels/delete-address-dto';
import { UpdateAddressDto } from '../../Models/AddressModels/update-address-dto';
import { AddressDto } from '../../Models/AuthModels/address-dto';
import { PaginatedResult } from '../../Models/DeliveryModels/paginated-result';


@Injectable({ providedIn: 'root' })
export class AddressService {
  constructor(private http: HttpClient) {}

  getMyAddresses(
    pageIndex = 1,
    pageSize = 5
  ): Observable<PaginatedResult<AddressDto>> {
    return this.http.get<PaginatedResult<AddressDto>>(Users.getMyAddresses, {
      params: { PageIndex: pageIndex, PageSize: pageSize },
    });
  }

  addAddress(
    userId: string,
    dto: AddCustomerAddressDto
  ): Observable<any> {
    return this.http.put(Users.updateCustomerAddress(userId), dto);
  }

  updateAddress(
    userId: string,
    dto: UpdateAddressDto
  ): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      Users.updateCustomerAddress(userId).replace('/address', '/addresses'),
      dto
    );
  }

  deleteAddress(
    userId: string,
    dto: DeleteAddressDto
  ): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      Users.updateCustomerAddress(userId).replace('/address', '/addresses'),
      { body: dto }
    );
  }
}
