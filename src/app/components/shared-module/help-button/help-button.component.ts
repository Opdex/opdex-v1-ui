import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HelpInfo } from '@sharedComponents/modals-module/help-modal/help-info';
import { HelpModalComponent } from '@sharedComponents/modals-module/help-modal/help-modal.component';
import { Subscription } from 'rxjs';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-help-button',
  templateUrl: './help-button.component.html',
  styleUrls: ['./help-button.component.scss']
})
export class HelpButtonComponent {
  @Input() icon: Icons;
  @Input() iconColor: string;
  @Input() info: HelpInfo = { paragraph: 'Paragraph explaining the statistic', title: 'Help Title' };
  helpIconSubscription: Subscription = new Subscription();
  icons = Icons;

  constructor(public dialog: MatDialog) { }

  openHelp(): void {
    this.dialog.open(HelpModalComponent, {
      width: '500px',
      data: this.info
    });
  }
}
