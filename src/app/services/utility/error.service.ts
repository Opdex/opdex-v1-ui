import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { OpdexErrorStatus } from '@sharedModels/errors/opdex-error';
import { HttpErrorResponse } from '@angular/common/http';
import { Notification } from '@sharedModels/notification';
import { LoggerService } from './logger.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(
    private _notify: NotificationService,
    private _log: LoggerService) { }

  handleError(error: OpdexErrorStatus): void {
    this._log.error(error.code);
    this._notify.alert(new Notification(error.title, error.message));
  }

  logHttpError(error: HttpErrorResponse, endpoint: string, body?: any): void {
    this._log.error(endpoint);

    if (body && !environment.production) {
      if (body.password) body.password = '';
      this._log.error(JSON.stringify(body));
    }

    this._log.error(error.error || error.message);
  }
}
