import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Nutrition } from '../../../Constants/Api_Urls';
import { NutritionResponse } from '../../../Models/NutritionModels/NutritionResponse';



@Injectable({
    providedIn: 'root'
})
export class NutritionService {

    private baseUrl = environment.apiUrl; 

    constructor(private http: HttpClient) { }

    calculateNutrition(basketId: string): Observable<NutritionResponse> {
        return this.http.post<NutritionResponse>(
            `${this.baseUrl}/${Nutrition.Calculate(basketId)}`, 
            {}
        );
    }
}