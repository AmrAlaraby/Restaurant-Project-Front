import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Auth } from '../../Constants/Api_Urls';
import { LoginRequestInterface } from '../../Models/AuthModels/login-request-interface';
import { TokenInterface } from '../../Models/AuthModels/token-interface';
import { RegisterationRequestInterface } from '../../Models/AuthModels/registeration-request-interface';
import { UserInterface } from '../../Models/AuthModels/user-interface';
import { RefreshTokenRequestInterface } from '../../Models/AuthModels/refresh-token-request-interface';
import { UpdateCurrentUserInterface } from '../../Models/AuthModels/update-current-user-interface';
import { ApiResponse } from '../../Models/AuthModels/api-response';
import { ResetCodeResponse } from '../../Models/AuthModels/reset-code-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient,private Router :Router) {}

login(data: LoginRequestInterface) {
  return this.http.post<ApiResponse<TokenInterface>>(
    Auth.login,
    data,
    { withCredentials: true }
  ).pipe(tap((res) => this.setSession(res.data)));
}

  register(data: RegisterationRequestInterface): Observable<ApiResponse<UserInterface>> {
    return this.http.post<ApiResponse<UserInterface>>(Auth.register, data);
  }

refreshToken(): Observable<ApiResponse<TokenInterface>> {
  return this.http.post<ApiResponse<TokenInterface>>(
    Auth.refresh,
    {},
    { withCredentials: true }
  ).pipe(tap((res) => this.setSession(res.data)));
}

  getCurrentUser(): Observable<UserInterface> {
    return this.http.get<UserInterface>(Auth.currentUser);
  }

  updateCurrentUser(email: string, dto: UpdateCurrentUserInterface): Observable<UserInterface> {
    return this.http.put<UserInterface>(`${Auth.UpdatecurrentUser}?email=${email}`, dto);
  }

sendResetCode(email: string) {
  return this.http.post(
    Auth.sendResetCode,
    JSON.stringify(email),
    {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'text' as 'json'
    }
  );
}

verifyCode(code: string) {
  return this.http.post<{ resetSessionToken: string }>(
    `${Auth.verifyResetCode}?code=${code}`,
    null
  );
}

resetPassword(data: {
  resetSessionToken: string;
  newPassword: string;
  confirmPassword: string;
}) {
  return this.http.post(Auth.resetPassword, data);
}

  logout(): void {
    localStorage.clear();
    this.Router.navigate(['/auth/login']);
  }

  private setSession(token: TokenInterface) {
    // if (token.accessToken) localStorage.setItem('accessToken', token.accessToken);

    // if (token.refreshToken) localStorage.setItem('refreshToken', token.refreshToken);

    // if (token.expiresAt) localStorage.setItem('expiresAt', token.expiresAt);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  isTokenExpired(): boolean {
  const expiresAt = localStorage.getItem('expiresAt');
  if (!expiresAt) return true;

  return new Date(expiresAt) <= new Date();
}
}
