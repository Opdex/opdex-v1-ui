import { UserContextService } from './../../services/utility/user-context.service';
import { ReviewQuoteComponent } from './../../components/tx-module/shared/review-quote/review-quote.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { switchMap, take, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { LiquidityPoolsSearchQuery } from '@sharedModels/requests/liquidity-pool-filter';
import { ILiquidityPoolSummary } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable, timer } from 'rxjs';
import { IGovernance } from '@sharedModels/responses/platform-api/governances/governance.interface';
import { environment } from '@environments/environment';
import { ITransactionQuote } from '@sharedModels/responses/platform-api/transactions/transaction-quote.interface';

@Component({
  selector: 'opdex-governance',
  templateUrl: './governance.component.html',
  styleUrls: ['./governance.component.scss']
})
export class GovernanceComponent implements OnInit {
  nominatedPools$: Observable<ILiquidityPoolSummary[]>;
  miningPools$: Observable<ILiquidityPoolSummary[]>;
  governance$: Observable<IGovernance>;
  governance: any;
  submitting: boolean;
  nominationPeriodEndDate: string;
  context: any;

  constructor(
    private _platformApiService: PlatformApiService,
    private _bottomSheet: MatBottomSheet,
    private _context: UserContextService
  ) { }

  ngOnInit(): void {
    this.context = this._context.getUserContext();

    this.governance$ = timer(0, 20000).pipe(switchMap(_ => {
       return this._platformApiService.getGovernance(environment.governanceAddress).pipe(tap((rsp: IGovernance) => {
        this.governance = rsp;
        const nominationRemainingSeconds = rsp.periodRemainingBlocks * 16;
        let date = new Date();
        date.setSeconds(date.getSeconds() + nominationRemainingSeconds);
        this.nominationPeriodEndDate = date.toISOString();
      }));
    }));

    this.nominatedPools$ = timer(0, 20000).pipe(switchMap(_ => {
      return this._platformApiService.getPools(new LiquidityPoolsSearchQuery('Liquidity', 'DESC', 0, 4, {nominated: true}));
    }));

    this.miningPools$ = timer(0, 20000).pipe(switchMap(_ => {
      return this._platformApiService.getPools(new LiquidityPoolsSearchQuery('Liquidity', 'DESC', 0, 4, {mining: true}));
    }));
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

    return dDisplay + hDisplay + mDisplay + sDisplay;
  }

  quoteDistribution(): void {
    const payload = { fullDistribution: true };

    this._platformApiService
      .rewardMiningPoolsQuote(this.governance.address, payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => {
          this._bottomSheet.open(ReviewQuoteComponent, {
            data: quote
          });
        });
  }
}
