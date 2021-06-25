import { UserContextService } from '../../../services/user-context.service';
import { Component, Input, OnInit } from '@angular/core';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { SidenavView } from '@sharedModels/sidenav-view';
import { SidenavService } from '@sharedServices/sidenav.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'opdex-liquidity-pool-card',
  templateUrl: './liquidity-pool-card.component.html',
  styleUrls: ['./liquidity-pool-card.component.scss']
})
export class LiquidityPoolCardComponent implements OnInit {
  @Input() pool: ILiquidityPoolSummaryResponse;
  context$: Observable<any>;

  constructor(private _sidebar: SidenavService, private _context: UserContextService) {
    this.context$ = this._context.getUserContext$();
  }

  ngOnInit(): void { }

  provide() {
    this._sidebar.openSidenav(SidenavView.pool, {pool: this.pool});
  }

  swap() {
    this._sidebar.openSidenav(SidenavView.swap, {pool: this.pool});
  }

  stake() {
    this._sidebar.openSidenav(SidenavView.stake, {pool: this.pool});
  }

  mine() {
    this._sidebar.openSidenav(SidenavView.mine, {pool: this.pool});
  }
}
