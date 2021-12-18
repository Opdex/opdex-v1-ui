import { NgModule } from '@angular/core';
import { VaultGovernanceComponent } from './views/vault-governance/vault-governance.component';
import { TradeComponent } from './views/trade/trade.component';
import { AuthComponent } from './views/auth/auth.component';
import { VaultComponent } from './views/vault/vault.component';
import { MiningGovernanceComponent } from './views/mining-governance/mining-governance.component';
import { Routes, RouterModule } from '@angular/router';
import { MarketComponent } from './views/market/market.component';
import { PoolsComponent } from './views/pools/pools.component';
import { PoolComponent } from './views/pool/pool.component';
import { TokensComponent } from './views/tokens/tokens.component';
import { TokenComponent } from './views/token/token.component';
import { WalletComponent } from './views/wallet/wallet.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { VaultGovernanceProposalComponent } from './views/vault-governance-proposal/vault-governance-proposal.component';

const routes: Routes = [
  { path: '', component: MarketComponent, data: { animation: 'MarketView', title: 'Market'} },
  { path: 'pools', component: PoolsComponent, data: { animation: 'PoolsView', title: 'Liquidity Pools'} },
  { path: 'pools/:pool', component: PoolComponent, data: { animation: 'PoolView', title: 'Liquidity Pool'} },
  { path: 'tokens', component: TokensComponent, data: { animation: 'TokensView', title: 'Tokens'} },
  { path: 'tokens/:token', component: TokenComponent, data: { animation: 'TokenView', title: 'SRC Token'} },
  { path: 'wallet', component: WalletComponent, data: { animation: 'WalletView', title: 'Wallet Summary'} },
  { path: 'governance', redirectTo: '/mining-governance' }, // Redirect for a while, twitter feed recently referenced this URL as of 11/25/21
  { path: 'mining-governance', component: MiningGovernanceComponent, data: { animation: 'MiningGovernanceView', title: 'Mining Governance'} },
  { path: 'vault-governance', component: VaultGovernanceComponent, data: { animation: 'VaultGovernanceView', title: 'Vault Governance'} },
  { path: 'vault-governance/proposal/:proposalId', component: VaultGovernanceProposalComponent, data: { animation: 'VaultGovernanceProposalView', title: 'Vault Proposal'} },
  { path: 'vault', component: VaultComponent, data: { animation: 'VaultView', title: 'Vault'} },
  { path: 'auth', component: AuthComponent, data: { animation: 'AuthView', title: 'Connect'} },
  { path: 'trade', component: TradeComponent, data: { animation: 'TradeView', title: 'Trade'} },
  { path: '**', component: NotFoundComponent, data: { animation: 'NotFoundView', title: 'Page Not Found'} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
