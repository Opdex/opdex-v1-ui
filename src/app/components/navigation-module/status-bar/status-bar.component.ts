import { UserContextService } from '@sharedServices/utility/user-context.service';
import { OnDestroy } from '@angular/core';
import { TransactionsService } from '@sharedServices/platform/transactions.service';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { IBlock } from '@sharedModels/platform-api/responses/blocks/block.interface';
import { ThemeService } from '@sharedServices/utility/theme.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BugReportModalComponent } from '@sharedComponents/modals-module/bug-report-modal/bug-report-modal.component';
import { Observable, Subscription } from 'rxjs';
import { environment } from '@environments/environment';
import { Icons } from 'src/app/enums/icons';
import { IconSizes } from 'src/app/enums/icon-sizes';

@Component({
  selector: 'opdex-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements OnDestroy {
  @Output() onMenuToggle = new EventEmitter<boolean>();
  @Input() menuOpen: boolean;
  latestSyncedBlock$: Observable<IBlock>;
  theme$: Observable<string>;
  network: string;
  subscription = new Subscription();
  pendingTransactions: string[] = [];
  iconSizes = IconSizes;
  icons = Icons;
  context: any;

  constructor(
    public dialog: MatDialog,
    private _theme: ThemeService,
    private _blocksService: BlocksService,
    private _transactionsService: TransactionsService,
    private _userContext: UserContextService
  ) {
    this.latestSyncedBlock$ = this._blocksService.getLatestBlock$();
    this.theme$ = this._theme.getTheme();
    this.network = environment.network;

    this.subscription.add(this._userContext.getUserContext$().subscribe(context => this.context = context));

    this.subscription.add(this._transactionsService.getBroadcastedTransactions$()
      .subscribe(txs => this.pendingTransactions = txs));
  }

  toggleTheme(theme: string) {
    this._theme.setTheme(theme);
  }

  toggleMenu(event: boolean) {
    this.onMenuToggle.emit(event);
    this.menuOpen = event;
  }

  openBugReport(): void {
    this.dialog.open(BugReportModalComponent, {
      width: '500px'
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
