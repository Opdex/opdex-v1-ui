import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { TransactionView } from '@sharedModels/transaction-view';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { ITransactionType, TransactionTypes } from '@sharedLookups/transaction-types.lookup';
import { ISidenavMessage } from '@sharedModels/transaction-view';
import { Observable, Subscription } from 'rxjs';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Icons } from 'src/app/enums/icons';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { UserContext } from '@sharedModels/user-context';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';

@Component({
  selector: 'opdex-tx-sidebar',
  templateUrl: './tx-sidebar.component.html',
  styleUrls: ['./tx-sidebar.component.scss']
})
export class TxSidebarComponent implements OnChanges {
  @Input() message: ISidenavMessage;
  @Input() showNavMenu: boolean = true;
  @Output() onModeChange = new EventEmitter<'over' | 'side'>();

  sidenavMode: 'over' | 'side' = 'over';
  transactionTypes: ITransactionType[];
  context$: Observable<any>;
  widescreen: boolean;
  subscription = new Subscription();
  context: UserContext;
  icons = Icons;
  iconSizes = IconSizes;
  pool: LiquidityPool;

  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _sidenav: SidenavService,
    private _context: UserContextService,
    private _env: EnvironmentsService
  ) {
    this.transactionTypes = !!this._env.vaultAddress
      ? [...TransactionTypes.filter(type => !!type.view)]
      : [...TransactionTypes.filter(type => !!type.view && type.view !== TransactionView.vaultProposal)]

    this.subscription.add(
      this._context.userContext$
        .subscribe(context => {
          this.context = context;

          const transactionTypes = !!this._env.vaultAddress
            ? [...TransactionTypes.filter(type => !!type.view)]
            : [...TransactionTypes.filter(type => !!type.view && type.view !== TransactionView.vaultProposal)];

            this.transactionTypes = transactionTypes.sort((a, b) => a.viewSortOrder - b.viewSortOrder);

          if (!!this.context?.wallet === false) {
            this.transactionTypes = this.transactionTypes.filter(type => !type.viewRequiresAuth);

            if (this.showNavMenu) this.closeSidenav();
          }
        }));

    this.subscription.add(
      this._breakpointObserver
        .observe(['(max-width: 1919px)'])
        .subscribe((result: BreakpointState) => {
          this.widescreen = !result.matches;
          if (!this.widescreen && this.sidenavMode === 'side') this.toggleSidenavMode();
          // Todo: When NOT widescreen (specifically mobile devices), route changes should close the sidebar
          // Closing sidebar wipes its state, consider implementing a service that can preserve state
        }));
  }

  ngOnChanges() {
    if (this.message && !this.message?.data?.pool && this.pool) {
      this.message.data = { pool: this.pool };
    }
  }

  toggleSidenavMode() {
    this.sidenavMode = this.sidenavMode == 'over' ? 'side' : 'over';
    this.onModeChange.emit(this.sidenavMode);
  }

  setTransactionView(view: TransactionView) {
    this.message.view = view;
  }

  closeSidenav() {
    this._sidenav.closeSidenav();
  }

  handlePoolSelection($event: LiquidityPool) {
    this.pool = $event;
    this.message.data = { pool: this.pool };
  }
}
