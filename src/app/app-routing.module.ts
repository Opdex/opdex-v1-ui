import { NgModule } from '@angular/core';
import { VaultComponent } from './views/vault/vault.component';
import { TradeComponent } from './views/trade/trade.component';
import { AuthComponent } from './views/auth/auth.component';
import { MiningGovernanceComponent } from './views/mining-governance/mining-governance.component';
import { Routes, RouterModule } from '@angular/router';
import { MarketComponent } from './views/market/market.component';
import { PoolsComponent } from './views/pools/pools.component';
import { PoolComponent } from './views/pool/pool.component';
import { TokensComponent } from './views/tokens/tokens.component';
import { TokenComponent } from './views/token/token.component';
import { WalletComponent } from './views/wallet/wallet.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { VaultProposalComponent } from './views/vault-proposal/vault-proposal.component';

const routes: Routes = [
  { path: '', component: MarketComponent, data: { animation: 'MarketView', title: 'Market'} },
  { path: 'pools', component: PoolsComponent, data: { animation: 'PoolsView', title: 'Liquidity Pools'} },
  { path: 'pools/:pool', component: PoolComponent, data: { animation: 'PoolView' } },
  { path: 'tokens', component: TokensComponent, data: { animation: 'TokensView', title: 'Tokens'} },
  { path: 'tokens/:token', component: TokenComponent, data: { animation: 'TokenView' } },
  { path: 'wallet', component: WalletComponent, data: { animation: 'WalletView', title: 'Wallet Summary'} },
  { path: 'governance', redirectTo: '/mining-governance' }, // Redirect for a while, twitter feed recently referenced this URL as of 11/25/21
  { path: 'mining-governance', redirectTo: '/mining' },
  { path: 'mining', component: MiningGovernanceComponent, data: { animation: 'MiningGovernanceView', title: 'Mining Governance'} },
  { path: 'vault', component: VaultComponent, data: { animation: 'VaultView', title: 'Vault'} },
  { path: 'vault/proposal/:proposalId', component: VaultProposalComponent, data: { animation: 'VaultProposalView' } },
  { path: 'auth', component: AuthComponent, data: { animation: 'AuthView', title: 'Connect'} },
  { path: 'trade', component: TradeComponent, data: { animation: 'TradeView', title: 'Trade'} },
  { path: '**', component: NotFoundComponent, data: { animation: 'NotFoundView', title: 'Page Not Found'} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
