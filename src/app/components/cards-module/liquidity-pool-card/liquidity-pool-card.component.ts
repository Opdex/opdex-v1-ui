import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Component, Input, OnInit } from '@angular/core';
import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';
import { TransactionView } from '@sharedModels/transaction-view';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'opdex-liquidity-pool-card',
  templateUrl: './liquidity-pool-card.component.html',
  styleUrls: ['./liquidity-pool-card.component.scss']
})
export class LiquidityPoolCardComponent {
  @Input() pool: ILiquidityPoolSummary;
  context$: Observable<any>;

  constructor(private _sidebar: SidenavService, private _context: UserContextService) {
    this.context$ = this._context.getUserContext$();
  }

  provide() {
    this._sidebar.openSidenav(TransactionView.provide, {pool: this.pool});
  }

  swap() {
    this._sidebar.openSidenav(TransactionView.swap, {pool: this.pool});
  }

  stake() {
    this._sidebar.openSidenav(TransactionView.stake, {pool: this.pool});
  }

  mine() {
    this._sidebar.openSidenav(TransactionView.mine, {pool: this.pool});
  }
}
