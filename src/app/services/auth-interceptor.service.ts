import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth-service.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const isLoginRequest = req.url.includes('/auth/login');
  
    if (token) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      return next.handle(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && !isLoginRequest) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }

          return throwError(() => error);
        }),
      );
    }
    
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !isLoginRequest) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      }),
    );
  }
  
}
