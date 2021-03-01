import { Injectable, ErrorHandler, Injector } from '@angular/core';
// import { LoggerService } from '@sharedServices/utility/logger.service';
// import { NotificationService } from '@sharedServices/utility/notification.service';

@Injectable({ providedIn: 'root' })
export class ErrorMiddlewareService implements ErrorHandler{
  constructor(private injector: Injector) { }

  // handles all uncaught errors throughout code and logs them.
  // This is logging more description stack traces. See how we can
  // get this type of logging in general StratisSwapErrors
  handleError(error: any) {
    // const logger = this.injector.get(LoggerService);
    // const notification = this.injector.get(NotificationService);

    // logger.error(error)
    // notification.alert({ title: 'Uncaught Error', 'body': 'Uh oh, looks like we missed something.' });
  }
}
