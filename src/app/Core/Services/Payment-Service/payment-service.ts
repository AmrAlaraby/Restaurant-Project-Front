import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from '../../Constants/Api_Urls';
import { PaginatedResult } from '../../Models/DeliveryModels/paginated-result';
import { PaymentDto } from '../../Models/PaymentModels/payment-dto';
import { PaymentQueryParams } from '../../Models/PaymentModels/payment-query-params';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {


    constructor(private http: HttpClient) { }

    pay(orderId: number): Observable<{ iframeUrl: string }> {
        return this.http.post<{ iframeUrl: string }>(
            Payment.pay(orderId),
            {}
        );
    }
  getAll(params: PaymentQueryParams): Observable<PaginatedResult<PaymentDto>> {
    let httpParams = new HttpParams();

    if (params.orderId   != null) httpParams = httpParams.set('orderId',   params.orderId);
    if (params.status)            httpParams = httpParams.set('status',    params.status);
    if (params.method)            httpParams = httpParams.set('method',    params.method);
    if (params.branchId  != null) httpParams = httpParams.set('branchId',  params.branchId);
    if (params.pageIndex != null) httpParams = httpParams.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) httpParams = httpParams.set('pageSize',  params.pageSize);

    return this.http.get<PaginatedResult<PaymentDto>>(Payment.getAll, { params: httpParams });
  }
}
