import { Component, OnInit } from '@angular/core';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'opdex-governance',
  templateUrl: './governance.component.html',
  styleUrls: ['./governance.component.scss']
})
export class GovernanceComponent implements OnInit {
  pools: ILiquidityPoolSummaryResponse[];

  constructor(private _platformApiService: PlatformApiService) { }

  ngOnInit(): void {
    this._platformApiService.getPools()
      .pipe(
        take(1),
        tap(pools => {
          this.pools = pools.sort((a, b) => b.volume.usd - a.volume.usd);
        })
      )
      .subscribe(pools => this.pools = pools.slice(0, 4));
  }
}
