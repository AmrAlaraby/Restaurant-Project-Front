import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Branch as BranchApi } from '../../Constants/Api_Urls';
import { Branch } from '../../Models/BranchModels/branch-interface';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private http = inject(HttpClient);

  getBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(BranchApi.getAll);
  }
}
