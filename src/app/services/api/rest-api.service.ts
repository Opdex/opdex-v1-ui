import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { JwtService } from './../utility/jwt.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '@sharedServices/utility/error.service';
import { throwError, Observable, of } from 'rxjs';
import { catchError, delay, map, mergeMap, retryWhen } from 'rxjs/operators';
import { Router } from '@angular/router';
import { OpdexHttpError } from '@sharedModels/errors/opdex-http-error';

// Retryable error codes
// Note 404 is excluded intentionally due to checking of wallet balances primarily in liquidity pools
// The check will always be made, likely often will fail and are not *expecting* it to succeed.
const retryableErrors = [401, 429, 500]

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  constructor(
    protected _http: HttpClient,
    protected _error: ErrorService,
    protected _jwt: JwtService,
    protected _userContextService: UserContextService,
    protected _router: Router,
    protected _env: EnvironmentsService
  ) { }

  protected get<T>(endpoint: string, options: object = {}): Observable<T> {
    return this._http.get<T>(endpoint, options)
      .pipe(
        retryWhen(err => {
          // Fancy way of retrying, we must throw our own errors after max attempts or RXJS won't catch correctly
          let retries = 0;

          return err.pipe(
            mergeMap((error) => retryableErrors.includes(error.status) ? of(error) : throwError(error)),
            delay(1000),
            map(error => {
              if (retries++ === 2) {
                throw error;
              }
              return error;
            })
          )
        }),
        catchError(error => this.handleError(error)));
  }

  protected post<T>(endpoint: string, payload: any, options: object = {}): Observable<T> {
    return this._http.post<T>(endpoint, payload, options)
      .pipe(catchError(error => this.handleError(error)));
  }

  protected put<T>(endpoint: string, payload: any, options: object = {}): Observable<T> {
    return this._http.put<T>(endpoint, payload, options)
      .pipe(catchError(error => this.handleError(error)));
  }

  protected patch<T>(endpoint: string, payload: any, options: object = {}): Observable<T> {
    return this._http.patch<T>(endpoint, payload, options)
      .pipe(catchError(error => this.handleError(error)));
  }

  protected delete<T>(endpoint: string, options: object = {}): Observable<T> {
    return this._http.delete<T>(endpoint, options)
      .pipe(catchError(error => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    }

    const errors = [];

    if (!!error?.error) {
      if (!!error.error.errors) {
        // Covers problem details validation errors - we don't care about they key, we'll tell the users all errors
        Object.keys(error.error.errors).map(key => errors.push(...error.error.errors[key]));
      }

      // Covers Exception based errors
      if (!!error.error.detail) {
        errors.push(error.error.detail);
      }
    }

    const errorResponse = new OpdexHttpError(errors, error.status);

    console.error(errorResponse);

    // Return an observable with a user-facing error messages
    return throwError(errorResponse);
  }
}


