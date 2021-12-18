import { Injectable, ErrorHandler, Injector } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorMiddlewareService implements ErrorHandler {
  constructor(private injector: Injector) { }

  // handles all uncaught errors throughout code and logs them.
  handleError(error: Error) {
    console.group('Unexpected Error:');
    console.log(error.name);
    console.log(error.message);
    console.log(error.stack);
    console.groupEnd();
  }
}
