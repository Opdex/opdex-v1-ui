import { HoldingsComponent } from './views/holdings/holdings.component';
import { HistoryComponent } from './views/history/history.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverviewComponent } from './views/overview/overview.component';
import { PoolsComponent } from './views/pools/pools.component';
import { PoolComponent } from './views/pool/pool.component';
import { TokensComponent } from './views/tokens/tokens.component';
import { TokenComponent } from './views/token/token.component';
import { NotFoundComponent } from './views/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: OverviewComponent },
  { path: 'pools', component: PoolsComponent },
  { path: 'pools/:pool', component: PoolComponent },
  { path: 'tokens', component: TokensComponent },
  { path: 'tokens/:token', component: TokenComponent },
  { path: 'holdings', component: HoldingsComponent },
  { path: 'history', component: HistoryComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
