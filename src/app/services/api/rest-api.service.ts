import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '@sharedServices/utility/error.service';
import { throwError, Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  constructor(protected _http: HttpClient, protected _error: ErrorService) { }

  protected get<T>(endpoint: string, options: object = {}): Observable<T> {
    return this._http.get<T>(endpoint, options)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  protected post<T>(endpoint: string, payload: any, options: object = {}): Observable<T> {
    return this._http.post<T>(endpoint, payload, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  protected put<T>(endpoint: string, payload: any, options: object = {}): Observable<T> {
    return this._http.put<T>(endpoint, payload, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  protected patch<T>(endpoint: string, payload: any, options: object = {}): Observable<T> {
    return this._http.patch<T>(endpoint, payload, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  protected delete<T>(endpoint: string, options: object = {}): Observable<T> {
    return this._http.delete<T>(endpoint, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
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


