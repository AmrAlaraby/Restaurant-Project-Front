import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from '../../Constants/Api_Urls';

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
    
    confirmCash(orderId: number) {
    return this.http.post(
      `https://localhost:7232/api/payment/confirm-cash/${orderId}`,
      {}
    );
  }
}