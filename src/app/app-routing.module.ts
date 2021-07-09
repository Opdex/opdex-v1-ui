import { AuthComponent } from './views/auth/auth.component';
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
import { AuthGuard } from '@sharedServices/guards/auth.guard';

const routes: Routes = [
  { path: '', component: MarketComponent, data: { animation: 'MarketView'}, canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: 'pools', component: PoolsComponent, data: { animation: 'PoolsView'}, canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: 'pools/:pool', component: PoolComponent, data: { animation: 'PoolView'}, canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: 'tokens', component: TokensComponent, data: { animation: 'TokensView'}, canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: 'tokens/:token', component: TokenComponent, data: { animation: 'TokenView'}, canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: 'wallet', component: WalletComponent, data: { animation: 'WalletView'}, canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: 'history', component: HistoryComponent, data: { animation: 'HistoryView'}, canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: 'governance', component: GovernanceComponent, data: { animation: 'GovernanceView'}, canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: 'vault', component: VaultComponent, data: { animation: 'VaultView'}, canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: 'auth', component: AuthComponent, data: { animation: 'AuthView'} },
  { path: '**', component: NotFoundComponent, data: { animation: 'NotFoundView'} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
