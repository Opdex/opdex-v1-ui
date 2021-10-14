import { JwtService } from './../utility/jwt.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '@sharedServices/utility/error.service';
import { throwError, Observable, of } from 'rxjs';
import { catchError, delay, map, mergeMap, retryWhen } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  constructor(
    protected _http: HttpClient,
    protected _error: ErrorService,
    protected _jwt: JwtService,
    protected _router: Router
  ) { }

  protected get<T>(endpoint: string, options: object = {}): Observable<T> {
    return this._http.get<T>(endpoint, options)
      .pipe(
        retryWhen(err => {
          // Fancy way of retrying, we must throw our own errors after max attempts or RXJS won't catch correctly
          let retries = 0;

          return err.pipe(
            // only retry 5xx errors
            mergeMap((error) => (error.status < 500 && error.status !== 401) ? throwError(error) : of(error)),
            delay(1000),
            map(error => {
              if (retries++ === 2) {
                throw error;
              }
              return error;
            })
          )
        }),
        catchError(error => this.handleError(error))
      );
  }

  protected post<T>(endpoint: string, payload: any, options: object = {}): Observable<T> {
    return this._http.post<T>(endpoint, payload, options)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  protected put<T>(endpoint: string, payload: any, options: object = {}): Observable<T> {
    return this._http.put<T>(endpoint, payload, options)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  protected patch<T>(endpoint: string, payload: any, options: object = {}): Observable<T> {
    return this._http.patch<T>(endpoint, payload, options)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  protected delete<T>(endpoint: string, options: object = {}): Observable<T> {
    return this._http.delete<T>(endpoint, options)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else if (error.status === 401) {
      // An Unauthorized error occurred
      if (this._jwt.isTokenExpired()) {
        this._jwt.removeToken();
        // this._router.navigateByUrl('/auth');
      }
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);

      this._error.logHttpError(error, error.url);
    }

    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}


