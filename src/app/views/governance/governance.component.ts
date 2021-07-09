import { take, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { LiquidityPoolsSearchQuery } from '@sharedModels/liquidity-pool-filter';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable } from 'rxjs';
import { IGovernanceResponseModel } from '@sharedModels/responses/platform-api/Governances/governance.interface';

@Component({
  selector: 'opdex-governance',
  templateUrl: './governance.component.html',
  styleUrls: ['./governance.component.scss']
})
export class GovernanceComponent implements OnInit {
  nominatedPools$: Observable<ILiquidityPoolSummaryResponse[]>;
  miningPools$: Observable<ILiquidityPoolSummaryResponse[]>;
  governance$: Observable<IGovernanceResponseModel>;
  governance: any;
  submitting: boolean;
  nominationPeriodEndDate: string;

  constructor(private _platformApiService: PlatformApiService) { }

  ngOnInit(): void {
    this.governance$ = this._platformApiService.getGovernance('PCYpioJXY4xBtf7h5nVBisKxZsqvCf5Bia').pipe(tap((rsp: IGovernanceResponseModel) => {
      this.governance = rsp;
      const nominationRemainingSeconds = rsp.periodRemainingBlocks * 16;
      let date = new Date();
      date.setSeconds(date.getSeconds() + nominationRemainingSeconds);
      this.nominationPeriodEndDate = date.toISOString();
    }));

    this.nominatedPools$ = this._platformApiService.getPools(new LiquidityPoolsSearchQuery('Liquidity', 'DESC', 0, 4, {nominated: true}));

    this.miningPools$ = this._platformApiService.getPools(new LiquidityPoolsSearchQuery('Liquidity', 'DESC', 0, 4, {mining: true}));
  }

  secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + "D " : "";
    var hDisplay = h > 0 ? h + "h " : "";
    var mDisplay = m > 0 ? m + "m " : "";
    var sDisplay = s > 0 ? s + "s" : "";
    console.log(dDisplay + hDisplay + mDisplay + sDisplay);
    return dDisplay + hDisplay + mDisplay + sDisplay;
  }

  distribute() {
    this.submitting = true;
    this._platformApiService.rewardMiningPools(this.governance.address).pipe(take(1)).subscribe(() => this.submitting = false);
  }
}
