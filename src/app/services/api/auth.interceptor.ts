import { AuthService } from '@sharedServices/utility/auth.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, switchMap, throwError } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // handle error
          // try get token
          // -- if token - use refresh token
          // ------------- set new access / refresh tokens
          // ------------- retry request
          console.log(`401 in interceptor`);
          return this._authService.refresh()
            .pipe(switchMap(_ => next.handle(req)));
        }

        return throwError(error);
      }));
  }
}
