import { Injectable } from '@angular/core';
import { Notification } from '@sharedModels/notification';
import { SuccessNotification, SuccessNotifications } from '@sharedLookups/success-notifications.lookup';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor() { }

  public alert(alert: Notification) {
  }

  public success(notification: SuccessNotification): void {
    const alertDetails = SuccessNotifications.find(alert => alert.id === notification);

    if (!alertDetails) {
      return;
    }

    const alert = { title: alertDetails.title, body: alertDetails.message };
  }
}
