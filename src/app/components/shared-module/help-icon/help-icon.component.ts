import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HelpInfo } from '@sharedComponents/modals-module/help-modal/help-info';
import { HelpModalComponent } from '@sharedComponents/modals-module/help-modal/help-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'opdex-help-icon',
  templateUrl: './help-icon.component.html',
  styleUrls: ['./help-icon.component.scss']
})
export class HelpIconComponent implements OnDestroy {

  @Input() info: HelpInfo = { paragraph: 'Paragraph explaining the statistic', title: 'Help Title' };

  constructor(public dialog: MatDialog) { }

  helpIconSubscription: Subscription = new Subscription();

  openHelp(): void {
    const dialogRef = this.dialog.open(HelpModalComponent, {
      width: '500px',
      data: this.info
    });

    this.helpIconSubscription.add(
      dialogRef.afterClosed().subscribe(result => {})
    );
  }

  ngOnDestroy(): void {
    this.helpIconSubscription.unsubscribe();
  }
}
