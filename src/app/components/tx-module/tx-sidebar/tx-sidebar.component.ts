import { Router } from '@angular/router';
import { TransactionView } from '@sharedModels/transaction-view';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TransactionTypes } from '@sharedLookups/transaction-types.lookup';
import { ISidenavMessage } from '@sharedModels/transaction-view';
import { Observable, Subscription } from 'rxjs';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-tx-sidebar',
  templateUrl: './tx-sidebar.component.html',
  styleUrls: ['./tx-sidebar.component.scss']
})
export class TxSidebarComponent {
  @Input() message:ISidenavMessage;
  @Output() onModeChange = new EventEmitter<'over' | 'side'>();

  sidenavMode: 'over' | 'side' = 'over';
  transactionTypes = [...TransactionTypes];
  context$: Observable<any>;
  widescreen: boolean;
  subscription = new Subscription();
  context: any;
  icons = Icons;

  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _sidenav: SidenavService,
    private _context: UserContextService,
    private _router: Router
  ) {
    this.subscription.add(this._context.getUserContext$().subscribe(context => this.context = context));

    this.subscription.add(
      this._breakpointObserver
        .observe(['(max-width: 1919px)'])
        .subscribe((result: BreakpointState) => {
          this.widescreen = !result.matches;
          if (!this.widescreen && this.sidenavMode === 'side') this.toggleSidenavMode();
          // Todo: When NOT widescreen, route changes should close the sidebar
          // Closing sidebar wipes its state, consider implementing a service that can preserve state
        }));
  }

  toggleSidenavMode() {
    this.sidenavMode = this.sidenavMode == 'over' ? 'side' : 'over';
    this.onModeChange.emit(this.sidenavMode);
  }

  handleConnectWallet() {
    this._router.navigateByUrl('/auth');
    if (!this.widescreen) {
      this.closeSidenav();
      return;
    }

    this.sidenavMode = 'side';
    this.onModeChange.emit(this.sidenavMode);
  }

  setTransactionView(view: TransactionView) {
    this.message.view = view;
  }

  closeSidenav() {
    this._sidenav.closeSidenav();
  }
}
