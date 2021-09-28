import { Injectable, ErrorHandler, Injector } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorMiddlewareService implements ErrorHandler {

  // Use injector in handleError, for example: this.injector.get(LoggerService);
  constructor(private injector: Injector) { }

  // handles all uncaught errors throughout code and logs them.
  handleError(error: string) {
    console.group('Unexpected Error:');
    console.log(error);
    console.groupEnd();
  }
}
