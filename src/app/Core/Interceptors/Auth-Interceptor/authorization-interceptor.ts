import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { AuthService } from '../../Services/Auth-Service/auth-service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authorizationInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  // ✅ مهم جدًا: خلي كل request يبعت cookies
  req = req.clone({
    withCredentials: true
  });

  // ⛔ skip login & register & refresh
  if (
    req.url.includes('login') ||
    req.url.includes('register') ||
    req.url.includes('refresh-token')
  ) {
    return next(req);
  }

  // ✅ add token
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401 && !req.url.includes('refresh-token')) {

        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap((res) => {
              isRefreshing = false;

              const newToken = res.data?.accessToken || null;
              refreshTokenSubject.next(newToken);

              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });

              return next(newReq);
            }),
            catchError((err) => {
              isRefreshing = false;
              authService.logout();
              return throwError(() => err);
            })
          );
        }

        return refreshTokenSubject.pipe(
          filter((token) => token != null),
          take(1),
          switchMap((token) => {
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token!}`
              }
            });

            return next(newReq);
          })
        );
      }

      return throwError(() => error);
    })
  );
};