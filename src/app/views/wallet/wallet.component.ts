import { catchError } from 'rxjs/operators';
import { Token } from '@sharedModels/ui/tokens/token';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { TokenAttributes } from '@sharedModels/platform-api/requests/tokens/tokens-filter';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IAddressBalance } from '@sharedModels/platform-api/responses/wallets/address-balance.interface';
import { Router } from '@angular/router';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { ITransactionsRequest } from '@sharedModels/platform-api/requests/transactions/transactions-filter';
import { Component, OnInit } from '@angular/core';
import { switchMap, take, tap } from 'rxjs/operators';
import { WalletsService } from '@sharedServices/platform/wallets.service';
import { Icons } from 'src/app/enums/icons';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { TransactionView } from '@sharedModels/transaction-view';
import { CollapseAnimation } from '@sharedServices/animations/collapse';
import { VaultProposalPledgesFilter } from '@sharedModels/platform-api/requests/vaults/vault-proposal-pledges-filter';
import { VaultProposalVotesFilter } from '@sharedModels/platform-api/requests/vaults/vault-proposal-votes-filter';
import { WalletBalancesFilter } from '@sharedModels/platform-api/requests/wallets/wallet-balances-filter';
import { StakingPositionsFilter } from '@sharedModels/platform-api/requests/wallets/staking-positions-filter';
import { MiningPositionsFilter } from '@sharedModels/platform-api/requests/wallets/mining-positions-filter';
import { of } from 'rxjs';

type CollapsableTable<T> = {
  filter: T,
  collapse?: boolean,
  count?: string
}
@Component({
  selector: 'opdex-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
  animations: [CollapseAnimation]
})
export class WalletComponent implements OnInit {
  wallet: any;
  showPreferences: boolean;
  crsBalance: IAddressBalance;
  crsBalanceValue: FixedDecimal;
  icons = Icons;
  iconSizes = IconSizes;
  showProposals: boolean;
  transactionsRequest: ITransactionsRequest;
  pledges: CollapsableTable<VaultProposalPledgesFilter>;
  votes: CollapsableTable<VaultProposalVotesFilter>;
  balances: CollapsableTable<WalletBalancesFilter>;
  providing: CollapsableTable<WalletBalancesFilter>;
  staking: CollapsableTable<StakingPositionsFilter>;
  mining: CollapsableTable<MiningPositionsFilter>;

  constructor(
    private _context: UserContextService,
    private _tokensService: TokensService,
    private _walletsService: WalletsService,
    private _router: Router,
    private _sidebar: SidenavService,
    private _env: EnvironmentsService
  ) {
    this.wallet = this._context.getUserContext();
    this.showProposals = !!this._env.vaultAddress;

    if (!this.wallet || !this.wallet.wallet) {
      this._router.navigateByUrl('/');
    }

    this.transactionsRequest = {
      limit: 15,
      direction: "DESC",
      eventTypes: [],
      sender: this.wallet.wallet
    };

    this.pledges = {
      filter: new VaultProposalPledgesFilter({
        pledger: this.wallet.wallet,
        limit: 5,
        direction: 'DESC',
        includeZeroBalances: false
      })
    };

    this.votes = {
      filter: new VaultProposalVotesFilter({
        voter: this.wallet.wallet,
        limit: 5,
        direction: 'DESC',
        includeZeroBalances: false
      })
    };

    this.balances = {
      filter: new WalletBalancesFilter({
        tokenAttributes: [TokenAttributes.NonProvisional],
        limit: 5,
        direction: 'DESC',
        includeZeroBalances: false
      })
    };

    this.providing = {
      filter: new WalletBalancesFilter({
        tokenAttributes: [TokenAttributes.Provisional],
        limit: 5,
        direction: 'DESC',
        includeZeroBalances: false
      })
    };

    this.staking = {
      filter: new StakingPositionsFilter({
        limit: 5,
        direction: 'DESC',
        includeZeroAmounts: false
      })
    };

    this.mining = {
      filter: new MiningPositionsFilter({
        limit: 5,
        direction: 'DESC',
        includeZeroAmounts: false
      })
    };
  }

  ngOnInit(): void {
    this._walletsService.getBalance(this.wallet.wallet, 'CRS')
      .pipe(
        catchError(_ => of({
          owner: this.wallet.wallet,
          token: 'CRS',
          balance: '0.00000000'
        } as IAddressBalance)),
        tap(crsBalance => this.crsBalance = crsBalance),
        switchMap(crsBalance => this._tokensService.getMarketToken(crsBalance.token)),
        tap((token: Token) => {
          const crsBalanceFixed = new FixedDecimal(this.crsBalance.balance, 8);
          this.crsBalanceValue = crsBalanceFixed.multiply(token.summary.priceUsd);
        }),
        take(1))
      .subscribe();
  }

  handleCount(count: string, type: string) {
    this[type].count = count;

    if (this[type].collapse === undefined) {
      this[type].collapse = count == '0'
    }
  }

  handleDeadlineChange(threshold: number): void {
    this.wallet.preferences.deadlineThreshold = threshold;
    this._context.setUserPreferences(this.wallet.wallet, this.wallet.preferences);
  }

  handleToleranceChange(threshold: number): void {
    this.wallet.preferences.toleranceThreshold = threshold;
    this._context.setUserPreferences(this.wallet.wallet, this.wallet.preferences);
  }

  togglePreferences(): void {
    this.showPreferences = !this.showPreferences;
  }

  handleTxOption($event: TransactionView): void {
    this._sidebar.openSidenav($event);
  }

  toggleTableCollapse(table: string) {
    this[table].collapse = !this[table].collapse;
  }
}
