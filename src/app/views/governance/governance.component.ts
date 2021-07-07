import { Component, OnInit } from '@angular/core';
import { LiquidityPoolsSearchQuery } from '@sharedModels/liquidity-pool-filter';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'opdex-governance',
  templateUrl: './governance.component.html',
  styleUrls: ['./governance.component.scss']
})
export class GovernanceComponent implements OnInit {
  nominatedPools$: Observable<ILiquidityPoolSummaryResponse[]>;
  miningPools$: Observable<ILiquidityPoolSummaryResponse[]>;

  constructor(private _platformApiService: PlatformApiService) { }

  ngOnInit(): void {
    this.nominatedPools$ = this._platformApiService.getPools(new LiquidityPoolsSearchQuery('Liquidity', 'DESC', 0, 4, {nominated: true}));
    this.miningPools$ = this._platformApiService.getPools(new LiquidityPoolsSearchQuery('Liquidity', 'DESC', 0, 4, {mining: true}));
  }
}
