import { SidenavService } from './../../../services/sidenav.service';
import { Component, Input, OnInit } from '@angular/core';
import { SidenavView } from '@sharedModels/sidenav-view';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';

@Component({
  selector: 'opdex-mining-card',
  templateUrl: './mining-card.component.html',
  styleUrls: ['./mining-card.component.scss']
})
export class MiningCardComponent implements OnInit {
  @Input() pool: ILiquidityPoolSummaryResponse;

  constructor(private _sidebar: SidenavService) { }

  ngOnInit(): void { }

  startMining() {
    this._sidebar.openSidenav(SidenavView.mine, {pool: this.pool});
  }

  stopMining() {
    this._sidebar.openSidenav(SidenavView.mine, {pool: this.pool});
  }
}
