import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { AuthService } from '../../Services/Auth-Service/auth-service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authorizationInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  // ⛔ skip login & register
  if (req.url.includes('login') || req.url.includes('register')) {
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

      // 🔥 لو Unauthorized
      if (error.status === 401) {

        // 🟢 أول request يعمل refresh
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap((res) => {
              isRefreshing = false;

              const newToken = res.data.accessToken? res.data.accessToken : null;
              refreshTokenSubject.next(newToken);

              // 💾 التوكن already بيتخزن في service

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

        // 🟡 باقي الـ requests تستنى
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