import { MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-maintenance-notification-modal',
  templateUrl: './maintenance-notification-modal.component.html',
  styleUrls: ['./maintenance-notification-modal.component.scss']
})
export class MaintenanceNotificationModalComponent {
  icons = Icons;

  constructor(private dialogRef: MatDialogRef<MaintenanceNotificationModalComponent>) {}

  proceed(): void {
    this.dialogRef.close(true);
  }
}
