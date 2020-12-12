import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverviewComponent } from './views/overview/overview.component';
import { PairsComponent } from './views/pairs/pairs.component';
import { PairComponent } from './views/pair/pair.component';
import { TokensComponent } from './views/tokens/tokens.component';
import { TokenComponent } from './views/token/token.component';
import { NotFoundComponent } from './views/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: OverviewComponent },
  { path: 'pairs', component: PairsComponent },
  { path: 'pairs/:pair', component: PairComponent },
  { path: 'tokens', component: TokensComponent },
  { path: 'tokens/:pair', component: TokenComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
