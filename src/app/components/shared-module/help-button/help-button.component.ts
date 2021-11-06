import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HelpInfo } from '@sharedModels/help-info';
import { HelpModalComponent } from '@sharedComponents/modals-module/help-modal/help-modal.component';
import { Subscription } from 'rxjs';
import { IconSizes } from 'src/app/enums/icon-sizes';
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
  iconSizes = IconSizes;

  constructor(public dialog: MatDialog) { }

  openHelp(): void {
    this.dialog.open(HelpModalComponent, {
      width: '500px',
      data: this.info
    });
  }
}
