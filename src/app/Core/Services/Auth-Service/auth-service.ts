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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  // =========================
  // Login
  // =========================
  login(data: LoginRequestInterface): Observable<TokenInterface> {
    return this.http.post<TokenInterface>(Auth.login, data).pipe(
      tap(token => this.setSession(token))
    );
  }

  // =========================
  // Register
  // =========================
  register(data: RegisterationRequestInterface): Observable<UserInterface> {
    return this.http.post<UserInterface>(Auth.register, data);
  }

  // =========================
  // Refresh Token
  // =========================
  refreshToken(): Observable<TokenInterface> {

    const body: RefreshTokenRequestInterface = {
      refreshToken: localStorage.getItem('refreshToken')
    };

    return this.http.post<TokenInterface>(Auth.refresh, body).pipe(
      tap(token => this.setSession(token))
    );
  }

  // =========================
  // Current User
  // =========================
  getCurrentUser(): Observable<UserInterface> {
    return this.http.get<UserInterface>(Auth.currentUser);
  }

  // =========================
  // Update Current User
  // =========================
  updateCurrentUser(
    email: string,
    dto: UpdateCurrentUserInterface
  ): Observable<UserInterface> {
    return this.http.put<UserInterface>(
      `${Auth.UpdatecurrentUser}?email=${email}`,
      dto
    );
  }

  // =========================
  // Logout
  // =========================
  logout(): void {
    localStorage.clear();
  }

  // =========================
  // Helpers
  // =========================
  private setSession(token: TokenInterface) {

    if (token.accessToken)
      localStorage.setItem('accessToken', token.accessToken);

    if (token.refreshToken)
      localStorage.setItem('refreshToken', token.refreshToken);

    if (token.expiresAt)
      localStorage.setItem('expiresAt', token.expiresAt);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
}
