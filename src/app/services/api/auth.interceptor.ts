import { UserContextService } from '@sharedServices/utility/user-context.service';
import { AuthService } from '@sharedServices/utility/auth.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, switchMap, throwError } from "rxjs";

const TOKEN_HEADER_KEY = 'authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private _authService: AuthService,
    private _userContextService: UserContextService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this._authService.refresh()
            .pipe(switchMap(_ => next.handle(this._addTokenHeader(req))));
        }

        return throwError(error);
      }));
  }

  private _addTokenHeader(request: HttpRequest<any>) {
    const token = `Bearer ${this._userContextService.accessToken}`;
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, token) });
  }
}
