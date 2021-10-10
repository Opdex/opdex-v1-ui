import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HelpInfo } from '@sharedComponents/modals-module/help-modal/help-info';
import { HelpModalComponent } from '@sharedComponents/modals-module/help-modal/help-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'opdex-help-button',
  templateUrl: './help-button.component.html',
  styleUrls: ['./help-button.component.scss']
})
export class HelpButtonComponent {

  @Input() info: HelpInfo = { paragraph: 'Paragraph explaining the statistic', title: 'Help Title' };

  constructor(public dialog: MatDialog) { }

  helpIconSubscription: Subscription = new Subscription();

  openHelp(): void {
    this.dialog.open(HelpModalComponent, {
      width: '500px',
      data: this.info
    });
  }
}
