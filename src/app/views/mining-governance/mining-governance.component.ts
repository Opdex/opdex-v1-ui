import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { IIndexStatus } from '@sharedModels/platform-api/responses/index/index-status.interface';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { IndexService } from '@sharedServices/platform/index.service';
import { MiningGovernancesService } from '@sharedServices/platform/mining-governances.service';
import { Subscription } from 'rxjs';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { ReviewQuoteComponent } from '@sharedComponents/tx-module/shared/review-quote/review-quote.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LiquidityPoolsFilter, LpOrderBy, NominationStatus, MiningStatus } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable } from 'rxjs';
import { IMiningGovernance } from '@sharedModels/platform-api/responses/mining-governances/mining-governance.interface';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { MiningGovernance } from '@sharedModels/ui/mining-governances/mining-governance';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { Icons } from 'src/app/enums/icons';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { MiningGovernanceStatCardsLookup } from '@sharedLookups/mining-governance-stat-cards.lookup';
import { RewardMiningPoolsRequest } from '@sharedModels/platform-api/requests/mining-governances/reward-mining-pools-request';
import { UserContext } from '@sharedModels/user-context';

@Component({
  selector: 'opdex-mining-governance',
  templateUrl: './mining-governance.component.html',
  styleUrls: ['./mining-governance.component.scss']
})
export class MiningGovernanceComponent implements OnInit, OnDestroy {
  nominatedPools: LiquidityPool[];
  miningPools$: Observable<LiquidityPool[]>;
  miningGovernance: MiningGovernance;
  submitting: boolean;
  nominationPeriodEndDate: string;
  context: UserContext;
  indexStatus: IIndexStatus;
  icons = Icons;
  iconSizes = IconSizes;
  subscription = new Subscription();
  miningGovernanceStatCardsInfo = MiningGovernanceStatCardsLookup.getStatCards();

  constructor(
    private _platformApiService: PlatformApiService,
    private _miningGovernanceService: MiningGovernancesService,
    private _bottomSheet: MatBottomSheet,
    private _userContextService: UserContextService,
    private _tokenService: TokensService,
    private _liquidityPoolsService: LiquidityPoolsService,
    private _indexService: IndexService,
    private _env: EnvironmentsService
  ) {
    this.nominatedPools = [null, null, null, null];
  }

  ngOnInit(): void {
    this.context = this._userContextService.userContext;

    this.subscription.add(
      this._indexService.latestBlock$
        .pipe(
          switchMap(_ => this._miningGovernanceService.getMiningGovernance(this._env.miningGovernanceAddress)),
          tap((rsp: IMiningGovernance) => this.miningGovernance = new MiningGovernance(rsp)),
          switchMap(governance => this._tokenService.getMarketToken(governance.minedToken)),
          tap(minedToken => this.miningGovernance.setMinedToken(minedToken)))
        .subscribe());

    const nominationFilter = new LiquidityPoolsFilter({orderBy: LpOrderBy.Liquidity, limit: 4, direction: 'DESC', nominationStatus: NominationStatus.Nominated});

    this.subscription.add(
      this._indexService.latestBlock$
        .pipe(switchMap(_ => this._liquidityPoolsService.getLiquidityPools(nominationFilter)))
        .subscribe(pools => this.nominatedPools = pools.results));

    this.subscription.add(
      this._indexService.status$
        .subscribe(status => this.indexStatus = status));

    this.miningPools$ = this._indexService.latestBlock$.pipe(switchMap(_ => {
      const filter = new LiquidityPoolsFilter({orderBy: LpOrderBy.Liquidity, limit: 4, direction: 'DESC', miningStatus: MiningStatus.Enabled});
      return this._liquidityPoolsService.getLiquidityPools(filter).pipe(map(pools => pools.results));
    }));
  }

  quoteDistribution(): void {
    if (!this.context?.wallet) return;

    const request = new RewardMiningPoolsRequest(true);

    this._platformApiService
      .rewardMiningPoolsQuote(this.miningGovernance.address, request.payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this._bottomSheet.open(ReviewQuoteComponent, { data: quote }));
  }

  poolsTrackBy(index: number, pool: LiquidityPool): string {
    return `${index}-${pool?.trackBy}`;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
