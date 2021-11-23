import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { NominationFilter } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { GovernancesService } from '@sharedServices/platform/governances.service';
import { Subscription } from 'rxjs';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { ReviewQuoteComponent } from '@sharedComponents/tx-module/shared/review-quote/review-quote.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LiquidityPoolsFilter, LpOrderBy, MiningFilter } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable } from 'rxjs';
import { IGovernance } from '@sharedModels/platform-api/responses/governances/governance.interface';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { Governance } from '@sharedModels/governance';
import { IRewardMiningPoolsRequest } from '@sharedModels/platform-api/requests/governances/reward-mining-pools-request';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { Icons } from 'src/app/enums/icons';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { GovernanceStatCardsLookup } from '@sharedLookups/governance-stat-cards.lookup';

@Component({
  selector: 'opdex-governance',
  templateUrl: './governance.component.html',
  styleUrls: ['./governance.component.scss']
})
export class GovernanceComponent implements OnInit, OnDestroy {
  nominatedPools: ILiquidityPoolResponse[];
  miningPools$: Observable<ILiquidityPoolResponse[]>;
  governance$: Subscription;
  governance: Governance;
  submitting: boolean;
  nominationPeriodEndDate: string;
  context: any;
  icons = Icons;
  iconSizes = IconSizes;
  subscription = new Subscription();
  governanceStatCardsInfo = GovernanceStatCardsLookup.getStatCards();

  constructor(
    private _platformApiService: PlatformApiService,
    private _governanceService: GovernancesService,
    private _bottomSheet: MatBottomSheet,
    private _context: UserContextService,
    private _tokenService: TokensService,
    private _liquidityPoolsService: LiquidityPoolsService,
    private _blocks: BlocksService,
    private _env: EnvironmentsService
  ) {
    this.nominatedPools = [ null, null, null, null ];
  }

  ngOnInit(): void {
    this.context = this._context.getUserContext();

    this.governance$ = this._blocks.getLatestBlock$()
      .pipe(
        switchMap(_ => {
          return this._governanceService.getGovernance(this._env.governanceAddress)
            .pipe(
              tap((rsp: IGovernance) => this.governance = new Governance(rsp)),
              switchMap(governance => this._tokenService.getToken(governance.minedToken)),
              tap(minedToken => this.governance.setMinedToken(minedToken)));
        })).subscribe();

    const nominationFilter = new LiquidityPoolsFilter({orderBy: LpOrderBy.Liquidity, limit: 4, direction: 'DESC', nominationFilter: NominationFilter.Nominated});

    this.subscription.add(
      this._blocks.getLatestBlock$()
        .pipe(switchMap(_ => this._liquidityPoolsService.getLiquidityPools(nominationFilter)))
        .subscribe(pools => this.nominatedPools = pools.results));

    this.miningPools$ = this._blocks.getLatestBlock$().pipe(switchMap(_ => {
      const filter = new LiquidityPoolsFilter({orderBy: LpOrderBy.Liquidity, limit: 4, direction: 'DESC', miningFilter: MiningFilter.Enabled});
      return this._liquidityPoolsService.getLiquidityPools(filter).pipe(map(pools => pools.results));
    }));
  }

  quoteDistribution(): void {
    const payload: IRewardMiningPoolsRequest = { fullDistribution: true };

    this._platformApiService
      .rewardMiningPoolsQuote(this.governance.address, payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this._bottomSheet.open(ReviewQuoteComponent, { data: quote }));
  }

  poolsTrackBy(index: number, pool: ILiquidityPoolResponse) {
    if (pool === null || pool === undefined) return index;
    return `${index}-${pool.address}-${pool.summary.cost.crsPerSrc}-${pool.summary.miningPool?.tokensMining}-${pool.summary.staking?.weight}`;
  }

  ngOnDestroy() {
    if (this.governance$) this.governance$.unsubscribe();
    this.subscription.unsubscribe();
  }
}
