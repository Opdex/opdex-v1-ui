import { HttpErrorResponse } from '@angular/common/http';

export class ApiResponse<T> {
  data: T;
  error: HttpErrorResponse;
  hasError: boolean;

  constructor(options: { data?: T, error?: HttpErrorResponse }) {
    this.data = options.data;
    this.error = options.error;
    this.hasError = this.error !== null && this.error !== undefined;
  }
}
