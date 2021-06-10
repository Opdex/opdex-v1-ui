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
  { path: '', component: MarketComponent },
  { path: 'pools', component: PoolsComponent },
  { path: 'pools/:pool', component: PoolComponent },
  { path: 'tokens', component: TokensComponent },
  { path: 'tokens/:token', component: TokenComponent },
  { path: 'wallet', component: WalletComponent },
  { path: 'history', component: HistoryComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
