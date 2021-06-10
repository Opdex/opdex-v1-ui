import { Component, Input, OnInit } from '@angular/core';
import { SidenavView } from '@sharedModels/sidenav-view';
import { SidenavService } from '@sharedServices/sidenav.service';

@Component({
  selector: 'opdex-liquidity-pool-card',
  templateUrl: './liquidity-pool-card.component.html',
  styleUrls: ['./liquidity-pool-card.component.scss']
})
export class LiquidityPoolCardComponent implements OnInit {
  @Input() pool: string = "ODX/CRS";

  constructor(private _sidebar: SidenavService) { }

  ngOnInit(): void { }

  provide() {
    this._sidebar.openSidenav(SidenavView.pool);
  }

  swap() {
    this._sidebar.openSidenav(SidenavView.swap);
  }

  stake() {
    this._sidebar.openSidenav(SidenavView.stake);
  }

  mine() {
    this._sidebar.openSidenav(SidenavView.mine);
  }
}
