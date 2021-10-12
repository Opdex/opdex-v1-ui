import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { Notification } from '@sharedModels/notification';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  constructor(private _notifications: NotificationService) { }

  public info = (data: any) => this._log('info', data);

  public warn = (data: any) => this._log('warn', data);

  public error = (data: any) => this._log('error', data);

  public verbose = (data: any) => this._log('verbose', data);

  public debug = (data: any) => this._log('debug', data);

  public silly = (data: any) => this._log('silly', data);

  private _log(level: string, data: string, notify = false) {
    if (notify) {
      this._notifications.alert(new Notification('Error', data));
    }
  }
}
