import { ILiquidityPoolSummaryResponse } from './../../models/responses/platform-api/Pools/liquidity-pool.interface';
import { take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';

@Component({
  selector: 'opdex-pools',
  templateUrl: './pools.component.html',
  styleUrls: ['./pools.component.scss']
})
export class PoolsComponent implements OnInit {
  pools: ILiquidityPoolSummaryResponse[];

  get poolsByVolume() {
    const pools = this.pools ? [...this.pools] : [];

    return pools.sort((a, b) => b.volume.usd - a.volume.usd);
  }

  constructor(private _platformApiService: PlatformApiService) { }

  ngOnInit(): void {
    this._platformApiService.getPools()
      .pipe(take(1))
      .subscribe(pools => this.pools = pools);
  }
}
