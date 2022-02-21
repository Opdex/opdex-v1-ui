import { Component } from '@angular/core';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-app-update-modal',
  templateUrl: './app-update-modal.component.html',
  styleUrls: ['./app-update-modal.component.scss']
})
export class AppUpdateModalComponent {
  icons = Icons;

  update(): void {
    window.location.reload();
  }
}
