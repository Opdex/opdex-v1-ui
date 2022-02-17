import { MaintenanceNotificationModalComponent } from '@sharedComponents/modals-module/maintenance-notification-modal/maintenance-notification-modal.component';
import { IIndexStatus } from '@sharedModels/platform-api/responses/index/index-status.interface';
import { IndexService } from '@sharedServices/platform/index.service';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { UserContext } from '@sharedModels/user-context';

@Component({
  selector: 'opdex-tx-quote-submit-button',
  templateUrl: './tx-quote-submit-button.component.html',
  styleUrls: ['./tx-quote-submit-button.component.scss']
})
export class TxQuoteSubmitButtonComponent implements OnDestroy {
  @Input() label: string = 'Quote';
  @Input() disabled: boolean;
  @Input() warn: boolean;
  @Input() size: string;
  @Output() onSubmit = new EventEmitter();
  context: UserContext;
  indexStatus: IIndexStatus;
  icons = Icons;
  iconSizes = IconSizes;
  subscription = new Subscription();

  constructor(
    private _context: UserContextService,
    private _router: Router,
    private _sidebarService: SidenavService,
    private _indexService: IndexService,
    private _dialog: MatDialog,
  ) {
    this.subscription.add(
      this._context.getUserContext$()
        .subscribe(context => this.context = context));

    this.subscription.add(
      this._indexService.getStatus$()
        .subscribe(status => this.indexStatus = status));
  }

  connectWallet(): void {
    this._router.navigateByUrl('/auth');
    this._sidebarService.closeSidenav();
  }

  submit(): void {
    if (!!this.indexStatus?.available === false) {
      this._dialog.open(MaintenanceNotificationModalComponent, {width: '500px', autoFocus: false})
        .afterClosed()
        .pipe(take(1))
        .subscribe(result => {
          if (result) this.onSubmit.emit();
        });
    } else {
      this.onSubmit.emit();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}