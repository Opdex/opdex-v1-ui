import { Injectable, ErrorHandler, Injector } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorMiddlewareService implements ErrorHandler {
  constructor(private injector: Injector) { }

  // handles all uncaught errors throughout code and logs them.
  handleError(error: string) {
    console.group('Unexpected Error:');
    console.log(error.toString());
    console.groupEnd();
  }
}
