import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { Router } from '@angular/router';
import { TransactionsService } from '@sharedServices/platform/transactions.service';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { ThemeService } from '@sharedServices/utility/theme.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IndexService } from '@sharedServices/platform/index.service';
import { IBlock } from '@sharedModels/platform-api/responses/blocks/block.interface';
import { Icons } from 'src/app/enums/icons';
import { MatDialog } from '@angular/material/dialog';
import { BugReportModalComponent } from '@sharedComponents/modals-module/bug-report-modal/bug-report-modal.component';

@Component({
  selector: 'opdex-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnDestroy {
  @Output() onPinnedToggle = new EventEmitter<boolean>();
  @Output() onRouteChanged = new EventEmitter<string>();
  @Input() mobileMenuOpen: boolean;
  isPinned: boolean = true;
  theme: string;
  latestSyncedBlock$: Observable<IBlock>;
  icons = Icons;
  iconSizes = IconSizes;
  network: string;
  subscription = new Subscription();
  pendingTransactions: string[] = [];
  usesVault: boolean;
  context: any;

  constructor(
    public dialog: MatDialog,
    private _context: UserContextService,
    private _theme: ThemeService,
    private _indexService: IndexService,
    private _transactionsService: TransactionsService,
    private _router: Router,
    private _env: EnvironmentsService
  ) {
    this.subscription.add(this._context.getUserContext$().subscribe(context => this.context = context));
    this.subscription.add(this._theme.getTheme().subscribe(theme => this.theme = theme))
    this.subscription.add(this._transactionsService.getBroadcastedTransactions$().subscribe(txs => this.pendingTransactions = txs));
    this.latestSyncedBlock$ = this._indexService.getLatestBlock$();
    this.network = this._env.network;
    this.usesVault = !!this._env.vaultAddress;
  }

  toggleTheme(): void {
    const theme = this.theme === 'light-mode' ? 'dark-mode' : 'light-mode';
    this._theme.setTheme(theme);
  }

  togglePin(): void {
    this.isPinned = !this.isPinned;
    this.onPinnedToggle.emit(this.isPinned);
  }

  emitRouteChange(url: string): void {
    this.onRouteChanged.emit(url);
  }

  openBugReport(): void {
    this.dialog.open(BugReportModalComponent, { width: '500px' });
  }

  logout(): void {
    this._context.setToken('');
    this._router.navigateByUrl('/');
    this.emitRouteChange('/');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
