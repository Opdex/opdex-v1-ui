import { VaultComponent } from './views/vault/vault.component';
import { GovernanceComponent } from './views/governance/governance.component';
import { HistoryComponent } from './views/history/history.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketComponent } from './views/market/market.component';
import { PoolsComponent } from './views/pools/pools.component';
import { PoolComponent } from './views/pool/pool.component';
import { TokensComponent } from './views/tokens/tokens.component';
import { TokenComponent } from './views/token/token.component';
import { WalletComponent } from './views/wallet/wallet.component';
import { NotFoundComponent } from './views/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: MarketComponent, data: { animation: 'MarketView'} },
  { path: 'pools', component: PoolsComponent, data: { animation: 'PoolsView'} },
  { path: 'pools/:pool', component: PoolComponent, data: { animation: 'PoolView'} },
  { path: 'tokens', component: TokensComponent, data: { animation: 'TokensView'} },
  { path: 'tokens/:token', component: TokenComponent, data: { animation: 'TokenView'} },
  { path: 'wallet', component: WalletComponent, data: { animation: 'WalletView'} },
  { path: 'history', component: HistoryComponent, data: { animation: 'HistoryView'} },
  { path: 'governance', component: GovernanceComponent, data: { animation: 'GovernanceView'} },
  { path: 'vault', component: VaultComponent, data: { animation: 'VaultView'} },
  { path: '**', component: NotFoundComponent, data: { animation: 'NotFoundView'} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
