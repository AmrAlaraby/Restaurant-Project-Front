import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ai } from '../../Constants/Api_Urls';
import { SuggestRequestDTO } from '../../Models/AiModels/suggest-request-dto';
import { SuggestResponseDTO } from '../../Models/AiModels/suggest-response-dto';


@Injectable({
  providedIn: 'root',
})
export class AiSuggestService {
  constructor(private http: HttpClient) {}

  suggest(request: SuggestRequestDTO): Observable<SuggestResponseDTO> {
    return this.http.post<SuggestResponseDTO>(Ai.suggest, request);
  }
}
