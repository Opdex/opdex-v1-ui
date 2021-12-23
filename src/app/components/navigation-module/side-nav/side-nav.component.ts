import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { Router } from '@angular/router';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
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
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'opdex-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnDestroy {
  @Output() onPinnedToggle = new EventEmitter<boolean>();
  @Output() onRouteChanged = new EventEmitter<string>();
  @Input() mobileMenuOpen: boolean;
  userContext$: Observable<any>;
  isPinned: boolean = false;
  theme$: Subscription;
  theme: 'light-mode' | 'dark-mode';
  latestSyncedBlock$: Observable<IBlock>;
  icons = Icons;
  iconSizes = IconSizes;
  network: string;
  subscription = new Subscription();
  pendingTransactions: string[] = [];
  usesVaultGovernance: boolean;
  usesVault: boolean;

  constructor(
    public dialog: MatDialog,
    private _context: UserContextService,
    private _theme: ThemeService,
    private _indexService: IndexService,
    private _transactionsService: TransactionsService,
    private _platformApiService: PlatformApiService,
    private _router: Router,
    private _env: EnvironmentsService
  ) {
    this.userContext$ = this._context.getUserContext$();
    this.theme$ = this._theme.getTheme().subscribe((theme: 'light-mode' | 'dark-mode') => this.theme = theme);
    this.latestSyncedBlock$ = this._indexService.getLatestBlock$();
    this.network = this._env.network;
    this.subscription.add(this._transactionsService.getBroadcastedTransactions$().subscribe(txs => this.pendingTransactions = txs));
    this.usesVaultGovernance = this._env.vaultGovernanceAddress?.length > 0;
    this.usesVault = this._env.vaultAddress?.length > 0;
  }

  toggleTheme() {
    this.theme = this.theme === 'light-mode' ? 'dark-mode' : 'light-mode';
    this._theme.setTheme(this.theme);
  }

  togglePin() {
    this.isPinned = !this.isPinned;
    this.onPinnedToggle.emit(this.isPinned);
  }

  emitRouteChange(url: string) {
    this.onRouteChanged.emit(url);
  }

  openBugReport(): void {
    this.dialog.open(BugReportModalComponent, { width: '500px' });
  }

  logout() {
    this._platformApiService.auth(null)
      .pipe(
        tap(token => this._context.setToken(token)),
        tap(_ => this._router.navigateByUrl('/')),
        tap(_ => this.emitRouteChange('/')),
        take(1))
      .subscribe();
  }

  ngOnDestroy() {
    if (this.theme$) this.theme$.unsubscribe();
    this.subscription.unsubscribe();
  }
}
