import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { ApiCallingService } from '../API/api-calling.service';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private api: ApiCallingService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log('Interceptor triggered for URL:', req.url);
    const token = this.api.getToken();

    if (token && !this.isTokenExpired(token)) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else if (token && this.isTokenExpired(token)) {
      // Token is expired, log out and redirect
      this.api.logout();
      this.router.navigate(['/login']);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.api.logout(); // Clear token
          this.router.navigate(['/login']); // Redirect to login
        }
        return throwError(error);
      })
    );
  }

  private isTokenExpired(token: string): boolean {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Math.floor(new Date().getTime() / 1000); // Current time in seconds
    return decodedToken.exp < currentTime; // Check if token expiry is in the past
  }
}
