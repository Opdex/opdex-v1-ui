import { Token } from '@sharedModels/ui/tokens/token';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { TokenAttributes } from '@sharedModels/platform-api/requests/tokens/tokens-filter';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { ThemeService } from '@sharedServices/utility/theme.service';
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
  showProposals: boolean;
  pledgesFilter: VaultProposalPledgesFilter;
  votesFilter: VaultProposalVotesFilter;
  walletBalancesFilter: WalletBalancesFilter;
  provisionalBalancesFilter: WalletBalancesFilter;
  transactionsRequest: ITransactionsRequest;
  stakingFilter: StakingPositionsFilter;
  miningFilter: MiningPositionsFilter;
  balanceCollapse: boolean = false;
  providingCollapse: boolean = true;
  miningCollapse: boolean = true;
  stakingCollapse: boolean = true;
  pledgingCollapse: boolean = true;
  votingCollapse: boolean = true;
  icons = Icons;
  iconSizes = IconSizes;

  constructor(
    private _context: UserContextService,
    private _tokensService: TokensService,
    private _walletsService: WalletsService,
    private _router: Router,
    private _theme: ThemeService,
    private _sidebar: SidenavService,
    private _env: EnvironmentsService
  ) {
    this.wallet = this._context.getUserContext();
    this.showProposals = !!this._env.vaultAddress;

    if (!this.wallet || !this.wallet.wallet) {
      this._router.navigateByUrl('/auth');
    }

    this.transactionsRequest = {
      limit: 15,
      direction: "DESC",
      eventTypes: [],
      sender: this.wallet.wallet
    };

    this.pledgesFilter = new VaultProposalPledgesFilter({
      pledger: this.wallet.wallet,
      limit: 5,
      direction: 'DESC',
      includeZeroBalances: false
    });

    this.votesFilter = new VaultProposalVotesFilter({
      voter: this.wallet.wallet,
      limit: 5,
      direction: 'DESC',
      includeZeroBalances: false
    });

    this.walletBalancesFilter = new WalletBalancesFilter({
      tokenAttributes: [TokenAttributes.NonProvisional],
      limit: 5,
      direction: 'DESC',
      includeZeroBalances: false});

    this.provisionalBalancesFilter = new WalletBalancesFilter({
      tokenAttributes: [TokenAttributes.Provisional],
      limit: 5,
      direction: 'DESC',
      includeZeroBalances: false});

    this.stakingFilter = new StakingPositionsFilter({
      limit: 5,
      direction: 'DESC',
      includeZeroAmounts: false});

    this.miningFilter = new MiningPositionsFilter({
      limit: 5,
      direction: 'DESC',
      includeZeroAmounts: false});
  }

  ngOnInit(): void {
    this._walletsService.getBalance(this.wallet.wallet, 'CRS')
      .pipe(
        tap(crsBalance => this.crsBalance = crsBalance),
        switchMap(crsBalance => this._tokensService.getMarketToken(crsBalance.token)),
        tap((token: Token) => {
          const costFixed = new FixedDecimal(token.summary.priceUsd.toString(), 8);
          const crsBalanceFixed = new FixedDecimal(this.crsBalance.balance, 8);

          this.crsBalanceValue = crsBalanceFixed.multiply(costFixed);
        }),
        take(1)).subscribe();
  }

  handleDeadlineChange(threshold: number): void {
    this.wallet.preferences.deadlineThreshold = threshold;
    this._context.setUserPreferences(this.wallet.wallet, this.wallet.preferences);
  }

  handleToleranceChange(threshold: number): void {
    this.wallet.preferences.toleranceThreshold = threshold;
    this._context.setUserPreferences(this.wallet.wallet, this.wallet.preferences);
  }

  toggleTheme(theme: string): void {
    this.wallet.preferences.theme = theme;
    this._context.setUserPreferences(this.wallet.wallet, this.wallet.preferences);
    this._theme.setTheme(theme);
  }

  togglePreferences(): void {
    this.showPreferences = !this.showPreferences;
  }

  handleTxOption($event: TransactionView): void {
    this._sidebar.openSidenav($event);
  }

  toggleBalanceCollapse(): void {
    this.balanceCollapse = !this.balanceCollapse;
  }

  toggleProvidingCollapse(): void {
    this.providingCollapse = !this.providingCollapse;
  }

  toggleMiningCollapse(): void {
    this.miningCollapse = !this.miningCollapse;
  }

  toggleStakingCollapse(): void {
    this.stakingCollapse = !this.stakingCollapse;
  }

  togglePledgingCollapse(): void {
    this.pledgingCollapse = !this.pledgingCollapse;
  }

  toggleVotingCollapse(): void {
    this.votingCollapse = !this.votingCollapse;
  }
}
